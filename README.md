# 🖥️ Samuel's Portfolio OS

A revolutionary portfolio website that simulates a complete operating system experience, inspired by Kali Linux's interface design. Built with SvelteKit, this portfolio transforms the traditional web portfolio into an interactive desktop environment where visitors can explore your work, skills, and background through familiar OS interactions.

![Portfolio OS Demo](https://img.shields.io/badge/Status-Live-brightgreen) ![SvelteKit](https://img.shields.io/badge/SvelteKit-2.0.0-ff3e00) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue) ![Responsive](https://img.shields.io/badge/Responsive-All%20Devices-green)

## 🌟 Features

### 🖥️ **Complete OS Simulation**
- **Desktop Environment**: Full desktop with wallpaper, icons, and window management
- **Taskbar**: Start menu, running applications, system tray with time and status
- **Window Management**: Draggable, resizable, and maximizable windows
- **Context Menus**: Right-click functionality for quick app access
- **File System**: Simulated file system with directories and files

### 🎨 **Kali Linux Inspired Design (Desktop) & Android-style (Mobile)**
- **Dark Theme**: Professional dark interface with red, green, and blue accents
- **Typography**: Ubuntu for UI, JetBrains Mono for terminal
- **Animations**: Smooth window transitions and hover effects
- **Particle Background**: Dynamic particle animation system
- **Responsive**: Desktop uses a Kali-like desktop; on mobile, the UI switches to an Android-style launcher with a status bar, home screen grid, and bottom navigation.

### 🚀 **Interactive Applications**

#### **Terminal/CLI**
- **Full Command Line**: Complete terminal experience with command history
- **Built-in Commands**: `help`, `ls`, `cd`, `pwd`, `cat`, `whoami`, `projects`, `about`, `contact`, `resume`, `date`, `uptime`, `neofetch`, `history`
- **Directory Navigation**: Change directories and explore file system
- **Command History**: Arrow key navigation through previous commands
- **Real-time Prompt**: Shows current directory in prompt

#### **File Manager**
- **Hierarchical Navigation**: Browse through simulated file system
- **Multiple View Modes**: Grid and list view options
- **File Operations**: Click to open files and applications
- **Path Display**: Current directory path shown in address bar
- **File Types**: Different icons and colors for different file types

#### **GitHub Projects Viewer**
- **Dynamic API Integration**: Fetches real projects from GitHub API
- **Project Details**: Descriptions, languages, stars, forks, topics
- **Interactive Cards**: Click to view detailed project information
- **Clone URLs**: Copy repository URLs and access live demos
- **Fallback System**: Hardcoded projects if API fails

#### **Resume Viewer**
- **PDF Display**: In-browser PDF viewer with zoom controls
- **Download Options**: Direct download and external link options
- **Responsive**: Adapts to different screen sizes
- **Professional Layout**: Clean interface for document viewing

#### **About Application**
- **Multi-tab Interface**: Overview, Education, Experience, Skills
- **Profile Image**: Professional headshot with circular design
- **Skill Visualization**: Interactive progress bars with color coding
- **Timeline**: Educational and professional background
- **Project Highlights**: Notable projects with descriptions

#### **Contact Application**
- **Working Contact Form**: Integrated with Formspree for email handling
- **Contact Information**: Email, GitHub, LinkedIn with copy functionality
- **Social Links**: Direct links to professional profiles
- **Form Validation**: Client-side validation with error handling
- **Professional Layout**: Clean, organized contact interface

## 🛠️ **Technical Stack**

### **Frontend**
- **SvelteKit 2.0.0**: Modern full-stack framework
- **TailwindCSS 3.4.13**: Utility-first CSS framework
- **Vite 5.0.3**: Fast build tool and dev server
- **Font Awesome 6.4.2**: Icon library
- **Google Fonts**: Ubuntu and JetBrains Mono typography

### **Animations & Effects**
- **Particles.js 2.0.0**: Background particle animation
- **Custom CSS Animations**: Window transitions and hover effects
- **AOS (Animate On Scroll)**: Scroll-triggered animations (legacy)

### **External Integrations**
- **GitHub API**: Dynamic project fetching
- **Formspree**: Contact form handling
- **CDN Resources**: External libraries and fonts

### **Development Tools**
- **ESLint**: Code linting with Svelte support
- **Prettier**: Code formatting
- **PostCSS**: CSS processing with Autoprefixer

## 📁 **Project Structure**

```
src/
├── app.html              # Main HTML template with particles
├── app.css               # Global styles and Tailwind imports
├── components/           # Svelte components
│   ├── Desktop.svelte    # Main desktop environment
│   ├── MobileShell.svelte # Android-style UI for mobile (launcher + full-screen apps)
│   ├── Window.svelte     # Draggable/resizable window system
│   ├── Taskbar.svelte    # Bottom taskbar with start menu
│   ├── DesktopIcons.svelte # Desktop application icons
│   ├── ContextMenu.svelte  # Right-click context menu
│   ├── Terminal.svelte   # CLI interface with commands
│   ├── FileManager.svelte # File system browser
│   ├── ProjectViewer.svelte # GitHub projects display
│   ├── ResumeViewer.svelte # PDF resume viewer
│   ├── AboutApp.svelte   # About Samuel application
│   └── ContactApp.svelte # Contact form application
├── routes/
│   ├── +layout.svelte    # App layout wrapper
│   └── +page.svelte      # Homepage (minimal)
└── lib/
    └── index.js          # Utility functions (empty)

static/
├── assets/
│   └── particles.json    # Particles.js configuration
├── document/
│   └── SamuelNdubuisiResume-Latest.pdf # Resume PDF
├── images/
│   ├── sam-svelte-bg.png # Profile image
│   ├── sam-svelte-bg2.jpg
│   └── sam-svelte-bg3.png
└── sam-logo.png          # Personal logo/favicon
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sammieblz/my-portfolio-site.git
   cd my-portfolio-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### **Build for Production**

```bash
npm run build
npm run preview
```

## 🎮 **How to Use**

### **Desktop Navigation**
- **Desktop Icons**: Click or double-click to open applications
- **Right-click**: Access context menu for quick app launching
- **Taskbar**: Click app buttons to switch between windows
- **Start Menu**: Click the Samuel logo to access all applications

### **Window Management**
### **Mobile (Android-style) Navigation**
- **Home Screen**: App launcher grid (Terminal, Files, Projects, Resume, About, Contact)
- **Open App**: Tap an icon to open a full-screen app view
- **App Header**: Back and close buttons at the top
- **Bottom Navigation**: Back, Home, Recents (Home returns to the launcher)
- **Status Bar**: Time, signal, Wi-Fi, battery indicators

- **Drag**: Click and drag window headers to move windows
- **Resize**: Drag bottom-right corner to resize windows
- **Maximize**: Click maximize button for full-screen mode
- **Minimize**: Click minimize button to hide windows
- **Close**: Click X button to close applications

### **Terminal Commands**
- `help` - Show available commands
- `ls` - List files and directories
- `cd <directory>` - Change directory
- `pwd` - Print working directory
- `cat <file>` - Display file contents
- `projects` - Show GitHub projects
- `about` - About Samuel
- `contact` - Contact information
- `resume` - Open resume
- `history` - Show command history
- `neofetch` - System information
- `clear` - Clear terminal
- `exit` - Close terminal

### **File Manager**
- **Navigate**: Use toolbar buttons or click folders
- **View Modes**: Toggle between grid and list view
- **File Operations**: Click files to open, double-click folders to enter
- **Path Display**: Current directory shown in address bar

## 🎨 **Customization**

### **Personal Branding**
- **Logo**: Replace `static/sam-logo.png` with your logo
- **Profile Image**: Update `static/images/sam-svelte-bg.png`
- **Resume**: Replace `static/document/SamuelNdubuisiResume-Latest.pdf`
- **Colors**: Modify color scheme in `src/app.css`

### **GitHub Integration**
- **Username**: Update `GITHUB_USERNAME` in `ProjectViewer.svelte`
- **Excluded Projects**: Modify `excludedProjects` array
- **Fallback Projects**: Update hardcoded project list

### **Particles Animation**
- **Configuration**: Modify `static/assets/particles.json`
- **Colors**: Change particle colors and effects
- **Density**: Adjust number of particles and connections

## 🔧 **Configuration**

### **Environment Variables**
Create a `.env` file for any API keys or configuration:

```env
# Contact form (optional - Formspree handles this)
VITE_FORMSPREE_ENDPOINT=your_formspree_endpoint

# GitHub API (optional - uses public API)
VITE_GITHUB_TOKEN=your_github_token
```

### **Build Configuration**
- **Vite**: Configured in `vite.config.js`
- **SvelteKit**: Configured in `svelte.config.js`
- **TailwindCSS**: Configured in `tailwind.config.js`
- **PostCSS**: Configured in `postcss.config.js`

## 📱 **Responsive Design**

The portfolio is fully responsive and works on:
- **Desktop**: Full OS experience with all features
- **Tablet**: Optimized layout with touch-friendly interactions
- **Mobile**: Simplified interface with essential features
- **Touch Devices**: Touch-friendly buttons and gestures

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

### **Netlify**
```bash
npm run build
# Upload dist folder to Netlify
```

### **GitHub Pages**
```bash
npm run build
# Push dist folder to gh-pages branch
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**Samuel Ndubuisi**
- **Email**: samuelndubuisi32@gmail.com
- **GitHub**: [@Sammieblz](https://github.com/Sammieblz)
- **LinkedIn**: [Samuel Ndubuisi](https://www.linkedin.com/in/samuel-ndubuisi-a4792a220)
- **Portfolio**: [Live Site](https://your-portfolio-url.com)

## 🙏 **Acknowledgments**

- **Kali Linux**: Design inspiration and color scheme
- **SvelteKit Team**: Amazing framework and documentation
- **TailwindCSS**: Utility-first CSS framework
- **Particles.js**: Beautiful particle animation library
- **Font Awesome**: Comprehensive icon library
- **GitHub**: API for dynamic project fetching

## 📊 **Project Stats**

![GitHub stars](https://img.shields.io/github/stars/Sammieblz/my-portfolio-site)
![GitHub forks](https://img.shields.io/github/forks/Sammieblz/my-portfolio-site)
![GitHub issues](https://img.shields.io/github/issues/Sammieblz/my-portfolio-site)
![GitHub last commit](https://img.shields.io/github/last-commit/Sammieblz/my-portfolio-site)

---

**⭐ If you like this project, please give it a star on GitHub!**

*This portfolio represents a unique approach to showcasing developer skills through an interactive operating system interface. It demonstrates proficiency in modern web technologies, UI/UX design, and creative problem-solving.*