"""Local-only certificate DOCX/PDF generation smoke test.

This script is intentionally not imported by the app or backend. It fills the
existing DOCX template and, when LibreOffice is available, converts it to PDF.
"""

from __future__ import annotations

import argparse
import calendar
import re
import shutil
import subprocess
import sys
import zipfile
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from tempfile import TemporaryDirectory


REPO_ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_PATH = REPO_ROOT / "certificate" / "BrainxAI_101_Certificate_Template.docx"
OUTPUT_DIR = REPO_ROOT / "local-output" / "certificate-test"

TEXT_NODE_RE = re.compile(r"(<w:t\b[^>]*>)(.*?)(</w:t>)", re.DOTALL)


@dataclass
class TextNode:
    match_start: int
    match_end: int
    open_tag: str
    text: str
    close_tag: str
    text_start: int
    text_end: int


def escape_xml(value: str) -> str:
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&apos;")
    )


def sanitize_filename_part(value: str) -> str:
    value = re.sub(r"\s+", "_", value.strip())
    value = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "", value)
    value = re.sub(r"_+", "_", value).strip("._ ")
    return value or "Student"


def parse_text_nodes(xml: str) -> tuple[list[TextNode], str]:
    nodes: list[TextNode] = []
    full_text_parts: list[str] = []
    offset = 0

    for match in TEXT_NODE_RE.finditer(xml):
        text = match.group(2)
        start = offset
        end = start + len(text)
        nodes.append(
            TextNode(
                match_start=match.start(),
                match_end=match.end(),
                open_tag=match.group(1),
                text=text,
                close_tag=match.group(3),
                text_start=start,
                text_end=end,
            )
        )
        full_text_parts.append(text)
        offset = end

    return nodes, "".join(full_text_parts)


def pick_target_node(nodes: list[TextNode], start: int, end: int, placeholder: str) -> int:
    core = placeholder.strip("{}")
    for index, node in enumerate(nodes):
        if node.text_start < end and node.text_end > start and core in node.text:
            return index

    for index, node in enumerate(nodes):
        if node.text_start < end and node.text_end > start:
            return index

    return 0


def rebuild_xml(xml: str, nodes: list[TextNode], updated_texts: list[str]) -> str:
    pieces: list[str] = []
    cursor = 0

    for node, updated_text in zip(nodes, updated_texts):
        pieces.append(xml[cursor:node.match_start])
        pieces.append(f"{node.open_tag}{updated_text}{node.close_tag}")
        cursor = node.match_end

    pieces.append(xml[cursor:])
    return "".join(pieces)


def replace_placeholder_in_text_nodes(xml: str, placeholder: str, replacement: str) -> str:
    while True:
        nodes, full_text = parse_text_nodes(xml)
        if not nodes:
            return xml

        start = full_text.find(placeholder)
        if start == -1:
            return xml

        end = start + len(placeholder)
        target_index = pick_target_node(nodes, start, end, placeholder)
        updated_texts = [node.text for node in nodes]

        for index, node in enumerate(nodes):
            if node.text_end <= start or node.text_start >= end:
                continue

            local_start = max(start, node.text_start) - node.text_start
            local_end = min(end, node.text_end) - node.text_start
            before = node.text[:local_start]
            after = node.text[local_end:]

            if index == target_index:
                updated_texts[index] = f"{before}{replacement}{after}"
            else:
                updated_texts[index] = f"{before}{after}"

        xml = rebuild_xml(xml, nodes, updated_texts)


def replace_placeholders(xml: str, replacements: dict[str, str]) -> str:
    updated = xml

    # Fast path for placeholders contained in a single XML text node.
    for placeholder, replacement in replacements.items():
        updated = updated.replace(placeholder, replacement)

    # Robust path for placeholders split across Word runs.
    for placeholder, replacement in replacements.items():
        updated = replace_placeholder_in_text_nodes(updated, placeholder, replacement)

    return updated


def find_soffice() -> str | None:
    candidates = [
        Path(r"C:\Program Files\LibreOffice\program\soffice.exe"),
        Path(r"C:\Program Files (x86)\LibreOffice\program\soffice.exe"),
    ]

    for candidate in candidates:
        if candidate.exists():
            return str(candidate)

    return shutil.which("soffice")


def fill_docx(template_path: Path, output_path: Path, name: str, month: str, year: str) -> None:
    replacements = {
        "{{recipient_name}}": escape_xml(name),
        "{{ISSUE_MONTH}}": escape_xml(month),
        "{{ISSUE_YEAR}}": escape_xml(year),
        # The current template uses these lowercase placeholders.
        "{{issue_month}}": escape_xml(month),
        "{{issue_year}}": escape_xml(year),
    }

    with zipfile.ZipFile(template_path, "r") as source_zip:
        with zipfile.ZipFile(output_path, "w") as output_zip:
            for item in source_zip.infolist():
                data = source_zip.read(item.filename)

                if item.filename.endswith(".xml"):
                    text = data.decode("utf-8")
                    data = replace_placeholders(text, replacements).encode("utf-8")

                output_zip.writestr(item, data)


def convert_to_pdf(docx_path: Path, output_dir: Path) -> Path | None:
    soffice = find_soffice()
    if not soffice:
        print(
            "DOCX generated, but PDF conversion requires LibreOffice. "
            "Install LibreOffice or add soffice to PATH."
        )
        return None

    with TemporaryDirectory(prefix="brain_ai_cert_") as temp_dir:
        temp_docx = Path(temp_dir) / docx_path.name
        shutil.copy2(docx_path, temp_docx)

        command = [
            soffice,
            "--headless",
            "--convert-to",
            "pdf",
            "--outdir",
            str(output_dir),
            str(temp_docx),
        ]
        result = subprocess.run(command, capture_output=True, text=True, check=False)

    if result.stdout.strip():
        print(result.stdout.strip())
    if result.stderr.strip():
        print(result.stderr.strip(), file=sys.stderr)

    pdf_path = output_dir / f"{docx_path.stem}.pdf"
    if result.returncode != 0 or not pdf_path.exists():
        print(
            "DOCX generated, but LibreOffice PDF conversion failed. "
            "Open the DOCX manually or check the LibreOffice installation.",
            file=sys.stderr,
        )
        return None

    return pdf_path


def parse_args() -> argparse.Namespace:
    today = date.today()

    parser = argparse.ArgumentParser(
        description="Generate a local test certificate DOCX and PDF from the BrainxAI 101 template."
    )
    parser.add_argument("--name", required=True, help='Recipient name, for example "Qixuan Wu".')
    parser.add_argument(
        "--month",
        default=calendar.month_name[today.month].upper(),
        help='Issue month in uppercase English, for example "JUNE". Defaults to current month.',
    )
    parser.add_argument(
        "--year",
        default=str(today.year),
        help='Four-digit issue year. Defaults to current year.',
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    name = " ".join(args.name.split())
    month = args.month.strip().upper()
    year = args.year.strip()

    if not TEMPLATE_PATH.exists():
        print(f"Template not found: {TEMPLATE_PATH}", file=sys.stderr)
        return 1

    if not re.fullmatch(r"\d{4}", year):
        print("--year must be a 4-digit year.", file=sys.stderr)
        return 1

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    safe_name = sanitize_filename_part(name)
    docx_path = OUTPUT_DIR / f"BrainxAI_101_Certificate_{safe_name}.docx"

    fill_docx(TEMPLATE_PATH, docx_path, name, month, year)
    pdf_path = convert_to_pdf(docx_path, OUTPUT_DIR)

    print(f"DOCX output: {docx_path}")
    if pdf_path:
        print(f"PDF output: {pdf_path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
