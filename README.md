# Brain × AI 101

An interactive neuroscience + AI learning platform that turns neurons, networks, filters, and feedback into guided web experiences.

## Preview

### Landing Page

<img src="docs/screenshots/landing.jpeg" alt="Brain × AI 101 landing page" width="100%" />

### Core Learning Modules

<table>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/module1-neuron.jpeg" alt="Module 1 biological neuron lesson" />
      <br />
      <strong>Module 1 · Biological Neurons</strong>
    </td>
    <td width="50%">
      <img src="docs/screenshots/module2-ann.jpeg" alt="Module 2 artificial neural network visualization" />
      <br />
      <strong>Module 2 · Artificial Neural Networks</strong>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/module2-cnn.jpeg" alt="Module 2 CNN filter and scanning lab" />
      <br />
      <strong>Module 2 · CNN Vision Lab</strong>
    </td>
    <td width="50%">
      <img src="docs/screenshots/module3-cluster.jpeg" alt="Module 3 clustering learning lab" />
      <br />
      <strong>Module 3 · Unsupervised Learning</strong>
    </td>
  </tr>
</table>

### Advanced Learning Labs

<table>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/module3-rl.jpeg" alt="Module 3 reinforcement learning grid lab" />
      <br />
      <strong>Reinforcement Learning Lab</strong>
    </td>
    <td width="50%">
      <img src="docs/screenshots/completion.jpeg" alt="Course completion page" />
      <br />
      <strong>Completion Page</strong>
    </td>
  </tr>
</table>

## Presenter Materials

- [Brain AI 101 speech PDF](docs/Brain_AI_101_SPPECH.pdf)

## What Learners Do

Learners move through a guided web experience that starts with biological neuron signals, then connects that idea to artificial neural networks and CNN filters. Each concept is paired with something students can manipulate: signals, layers, kernels, clustering points, rewards, and feedback loops.

The course includes a skipable pre-course evaluation, three interactive learning modules, a post-course feedback and knowledge check flow, and a completion page. The result is a classroom-friendly frontend that makes abstract AI ideas visible without turning the experience into a textbook.

## Built Features

| Feature | What it does | Implementation |
| --- | --- | --- |
| Guided course flow | Moves learners from landing page through evaluation, modules, and completion | React single-page flow controlled by app-level state |
| Interactive neuron lesson | Makes neuron inputs, threshold behavior, and firing visible | Module-owned React sections with animated anatomy, signal, and PhET simulation surfaces |
| Neural network and CNN labs | Shows how weights, activations, layers, and filters create recognition | SVG/React visualizations, controlled lab state, and embedded CNN Explainer support |
| Feedback and learning labs | Lets learners explore clustering, backpropagation, and reinforcement learning | Interactive Module 3 labs with local state, animated feedback, and configurable controls |
| Evaluation workflow | Captures pre/post responses, scores knowledge checks, and supports completion | Redux-backed evaluation state, local persistence, structured question data, and optional API submission |

## How the App Is Built

Brain × AI 101 is a React + Vite single-page app. It uses app-level view state instead of React Router because the product is a guided course flow rather than a collection of independent pages.

Each module owns its interactive sections, while shared UI handles navigation, progress, hooks, and evaluation state. Redux Toolkit tracks current view, module progress, pre-course evaluation, and course evaluation state.

Progress and attempts persist locally with `localStorage` and session storage. When backend support is enabled, Vercel Functions, Prisma, and PostgreSQL can store quiz attempts, evaluation submissions, and admin-facing records.

## Evaluation Flow

- The pre-course evaluation is optional and can be skipped.
- The post-course evaluation includes feedback questions and a knowledge check.
- Quiz scoring uses structured question data and answer keys.
- Submissions are stored locally first and can optionally be sent to the backend.

## Tech Stack

- Frontend: React 19, Vite
- State: Redux Toolkit
- Animation/visualization: Framer Motion, GSAP, Three.js / React Three Fiber
- Backend: Vercel Functions, Prisma, PostgreSQL
- Deployment: Vercel, GitHub Pages

## Run Locally

```bash
npm install
npm run dev
npm run dev:full
npm run build
npm run test:run
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:seed
```

Use `npm run dev` for the Vite frontend. Use `npm run dev:full` when you need local Vercel Functions.

## Deployment

GitHub Pages works for a frontend-only deployment from the generated `dist` folder:

```bash
npm run deploy
```

Use Vercel when API routes, backend submissions, or Prisma-backed persistence are needed:

```bash
npm run vercel-build
```

The Vercel output directory is `dist`.

## External Resources

- PhET Neuron
- CNN Explainer
- TensorFlow Playground

## Attribution

Attribution links used by the app are recorded in `src/assets/attribute.txt`
