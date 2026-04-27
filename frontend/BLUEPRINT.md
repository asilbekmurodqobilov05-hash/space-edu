# PRODUCT BLUEPRINT: UZ COSMOS
**The Cosmic Career Academy & Interactive Galaxy**

## 1. EXECUTIVE SUMMARY
UZ COSMOS is an immersive, game-based EdTech platform that merges the exploratory thrill of a video game with a rigorous, project-based learning curriculum. Users do not just "take courses"—they enlist as Astronauts, navigate a 3D galaxy, and embark on missions that prepare them for real-world space careers. 

## 2. GAME STRUCTURE & NAVIGATION
### 2.1 The 3D Galaxy Map (Main Interface)
*   **Concept:** The traditional "course list" is replaced by an interactive 3D star map.
*   **Nodes:** Each planet, moon, or space station represents a specific Course or Career Track.
*   **Progression:** Planets are locked/unlocked based on the user's XP, Fuel, and completed prerequisites.
*   **Avatar:** Users create a profile, selecting an Astronaut class and a starter Spaceship.

## 3. CAREER PATHS (The Curriculum)
The platform offers four distinct, real-world aligned career tracks.

### 3.1 Space Engineer
*   **Focus:** Propulsion, structural integrity, robotics.
*   **Skills:** Physics, CAD basics, resource management.
*   **Projects:** Design a multi-stage rocket; Build a rover suspension system.

### 3.2 AstroBiologist
*   **Focus:** Extraterrestrial life, closed-loop ecosystems, radiation effects.
*   **Skills:** Biology, chemistry, environmental science.
*   **Projects:** Create a Mars colony biosphere model; Analyze soil samples for microbial life.

### 3.3 Space Pilot
*   **Focus:** Orbital mechanics, navigation, spacecraft operation.
*   **Skills:** Mathematics, spatial awareness, quick decision-making.
*   **Projects:** Calculate a Hohmann transfer orbit; Manually dock with the ISS in a simulation.

### 3.4 Space Programmer
*   **Focus:** Flight software, automation, telemetry analysis.
*   **Skills:** Logic, Python/JavaScript, data structures.
*   **Projects:** Write a script to automate solar panel deployment; Build logic for an autonomous rover.

## 4. MISSION DESIGN & PROJECT-BASED LEARNING
### 4.1 Mission Structure (Replacing Lessons)
*   **Briefing:** Short, engaging explanation of the science/concept.
*   **Scenario:** A high-stakes, narrative-driven problem (e.g., "Oxygen levels dropping on Mars descent").
*   **Execution:** Interactive activity (simulation, coding challenge, or decision tree).
*   **Debrief:** Review of the outcome and real-world application.

### 4.2 Project & Portfolio System
*   **Unit Capstones:** Every unit ends with a practical project.
*   **The Portfolio:** Completed projects are automatically compiled into a sleek, shareable "Astronaut Dossier" (Portfolio). This acts as a verifiable record of skills for future educational or career opportunities.

## 5. PROGRESSION & REWARD SYSTEM
### 5.1 Ranks & Mastery
*   **Ranks:** Beginner → Explorer → Specialist → Professional / Commander.
*   **Skill Mastery:** Tracked per skill (Not Started → In Progress → Skilled → Mastered).

### 5.2 Economy & Gamification
*   **XP (Experience Points):** Earned by completing missions. Used to level up ranks.
*   **Fuel:** Earned through daily logins and perfect mission scores. Required to travel to distant, advanced planets.
*   **Badges:** Achievement markers (e.g., "Junior Engineer", "Mars Specialist").
*   **Upgrades:** XP and Fuel can be used to unlock new spaceship skins, dashboard themes, and advanced simulation tools.

## 6. ADAPTIVE AI ENGINE
*   **Struggle Detection:** If a user fails a mission or takes too long, the AI intervenes. It provides contextual hints, scales down the difficulty, or offers a remedial "training simulation."
*   **Excellence Detection:** If a user aces missions rapidly, the AI unlocks "Hardcore Mode" challenges, offering bonus XP and rare badges.

## 7. SPACE LAB (Sandbox Simulations)
A dedicated free-play zone where users can experiment with physics and engineering without the pressure of a mission.
*   **Simulators:** Rocket Launch Control, Satellite Orbit Mechanics, Planetary Environment Manipulator (Meteor showers, dust storms).
*   *Note: Initial versions of these simulators are already implemented in the platform.*

## 8. DASHBOARD & TELEMETRY
The user's central hub (Command Center).
*   **Metrics:** Overall progress %, current active mission, Fuel/XP reserves.
*   **Analytics:** Radar charts showing strengths and weaknesses across the 4 career tracks.
*   **Navigation:** AI-recommended "Next Planet" based on current skill gaps.
*   **Portfolio Access:** Quick link to their shareable project dossier.

## 9. VISUAL DESIGN & UI/UX
*   **Theme:** Deep space dark mode (`#010104` backgrounds).
*   **Accents:** Neon blue (`#00f3ff`) and electric purple (`#b537f2`) for interactive elements and glow effects.
*   **Typography:** Modern, technical sans-serif (e.g., Inter or Space Grotesk).
*   **Motion:** Smooth, cinematic transitions. Hover effects that mimic holographic interfaces.

## 10. TECHNICAL IMPLEMENTATION PLAN (Next Steps)
1.  **Phase 1: Career Architecture:** Implement the data structures for the 4 Career Paths and update the routing to support them.
2.  **Phase 2: The Command Dashboard:** Build the user dashboard showing XP, Ranks, and the Radar Chart of skills.
3.  **Phase 3: Portfolio System:** Create the UI for saving and displaying end-of-unit projects.
4.  **Phase 4: 3D Galaxy Map:** Replace the standard course list with an interactive Three.js/React Three Fiber planetary map.
5.  **Phase 5: Adaptive AI:** Integrate the logic to scale mission difficulty based on user success rates.
