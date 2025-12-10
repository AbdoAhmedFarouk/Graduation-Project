# 🎨 2D / 3D Website

A modern **web-based 2D & 3D design editor** built for creating, selecting, and manipulating geometries in real time. The project features an intuitive **middle toolbar**, dynamic **shape switching**, and **global state synchronization** for a smooth UX.




## ✨ Features

* ✅ **2D & 3D Shape Creation** (Rectangle, Circle, Star, Cube, Sphere, Torus, etc.)
* ✅ **Dynamic Toolbar Icons & Labels**
  * Icons and labels change based on the selected shape
  * No forced fallback to default shapes
* ✅ **Global State Management** using Zustand
* ✅ **Real-time Scene Updates**
* ✅ **Clean Component Architecture**
* ✅ **Scalable for Future Tools** (Text, Pen, Comment, etc.)




## 🛠 Tech Stack

* **Frontend:** Next.js / React
* **State Management:** Zustand
* **3D Rendering:** Three.js
* **Icons:** Lucide React
* **Styling:** Tailwind CSS & Shadcn-ui
* **Language:** TypeScript

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git

# Navigate into the project
cd your-repo-name

# Install dependencies
npm install

# Run the project
npm run dev
```




## 🧠 Core Concept

The website separates **2D shapes** and **3D shapes** into independent logical systems:
* ✅ A professional design-tool-like UX




## 🧩 State Management Overview

* Global scene state is managed using **Zustand**
* The following are synchronized across the app:

  * Desired shape
  * Last selected 2D shape
  * Last selected 3D shape
  * Selected object in the 3D scene




## 🖥 UI Overview

* **Middle Toolbar**

  * 2D Shapes Dropdown
  * 3D Shapes Dropdown
  * Text Tool
  * Pen Tool
  * Comment Tool

Each dropdown updates dynamically based on user selection and stored state.




## 📁 Project Structure (Simplified)

```
src/
│
├── app/
├── components/
│   ├── ShapesButton.tsx
│   ├── ShapeToolButton.tsx
│
├── store/
│   └── store.ts
│
├── validators/
│
└── styles/
```




## 🚀 Future Improvements

* 🔄 Drag & Drop support for shapes
* 🎯 Transform controls (translate, rotate, scale)
* 🧱 Material & color editor
* 💾 Scene save & export
* 🧠 AI-assisted design tools




## 🤝 Contribution

Contributions are welcome!

```bash
# Create a new branch

git checkout -b feature/new-feature

# Commit your changes

git commit -m "Add new feature"

# Push the branch

git push origin feature/new-feature
```

---

## 🧑‍💻 Author

Developed with ❤️ by **Abdelrahman Ahmed**

* Frontend Developer (React / Next.js)
* 3+ years of experience

---

## 📜 License

This project is licensed under the **MIT License**.

---

> If you like this project, don’t forget to ⭐ star the repo!
