// js/notifications.js

import { el } from "./ui.js";

class NotificationManager {
  constructor() {
    this.queue = [];
    this.isShowing = false;
  }

  show(notification) {
    this.queue.push(notification);

    if (!this.isShowing) {
      this.displayNext();
    }
  }

  displayNext() {
    if (this.queue.length === 0) {
      this.isShowing = false;
      return;
    }

    this.isShowing = true;

    const notification = this.queue.shift();

    const card = document.createElement("div");
    card.className = "notification";

    card.innerHTML = `
        <div class="notification-icon">${notification.icon ?? ""}</div>

        <div class="notification-content">
            <div class="notification-title">
                ${notification.title ?? ""}
            </div>

            <div class="notification-message">
                ${notification.message ?? ""}
            </div>

            ${
              notification.reward
                ? `<div class="notification-reward">${notification.reward}</div>`
                : ""
            }
        </div>
    `;

    el.notificationContainer.appendChild(card);

    // Animation will come next

    card.classList.add("show");

    setTimeout(() => {
      card.classList.remove("show");
      card.classList.add("hide");

      setTimeout(() => {
        card.remove();
        this.displayNext();
      }, 350);
    }, 3000);
  }
}

export const notifications = new NotificationManager();
