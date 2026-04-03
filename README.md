# 💊 Smart Medicine Reminder and Tracker

**MedTrack** is a high-fidelity, client-side web application designed to help patients manage their medication schedules, track adherence, and monitor stock levels. With a clean, modern "Health-Tech" aesthetic, it provides a seamless experience for maintaining health routines.

## 🚀 Key Features

### 1. Intelligent Dashboard
* **Daily Progress:** Visual progress bar showing doses taken vs. total doses scheduled for the day.
* **Next Dose Alert:** A high-visibility card that dynamically calculates and displays the countdown to your next upcoming medication.
* **KPI Metrics:** At-a-glance cards for total active medicines, today's taken count, pending doses, and your 7-day adherence rate.

### 2. Smart Scheduling & Tracking
* **Timeline View:** A vertical, connector-style timeline that visually distinguishes between taken, missed, upcoming, and skipped doses.
* **Flexible Frequency:** Supports multiple doses per day (1x, 2x, 3x, or 4x) with customizable time slots.
* **Dose Actions:** One-click buttons to mark doses as "Taken," "Skipped," or "Missed," with an "Undo" feature for accidental clicks.

### 3. Inventory & Stock Management
* **Low Stock Alerts:** Automated notifications when medicine units fall below a user-defined threshold.
* **Visual Stock Bars:** Color-coded progress bars (Green/Amber/Red) indicating remaining supply.
* **Quick Refill:** One-click "+30 units" refill button within the "My Medicines" management grid.

### 4. Adherence Analytics
* **Weekly Ring:** A circular SVG chart visualizing your 7-day adherence percentage.
* **History Logs:** A searchable, filterable table recording every dose action with timestamps, status, and dosage details.

### 5. Reminders & Notifications
* **Real-time Alerts:** System-generated notifications for due doses, missed doses, and low stock levels.
* **Notification Center:** A dedicated panel to review, dismiss, or mark all alerts as read.

---

## 🛠️ Technical Specifications

* **Frontend:** HTML5, CSS3 (Modern Flexbox/Grid), and Vanilla JavaScript (ES6+).
* **Typography:** 'DM Sans' for a clean interface and 'DM Mono' for precise time displays.
* **Storage:** Persistent data management using **`localStorage`** (No database setup required—your data stays on your device).
* **Design System:** Custom CSS variable-based design system featuring responsive layouts and smooth micro-interactions.

---

## 📖 How to Use

1.  **Add Medicine:** Navigate to "Add Medicine" and enter the name, dosage, frequency, and current stock.
2.  **Monitor:** Use the "Dashboard" to see what's due next.
3.  **Track:** When you take a pill, click **"Take"** on the dashboard or "Today's Schedule."
4.  **Review:** Check the **"History"** tab to see your consistency over time.
5.  **Refill:** When a stock bar turns red, click the refill button in **"My Medicines."**

---

*Developed for better health management.*
