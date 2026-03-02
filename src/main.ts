// Import service worker registration
import './sw-register';

// Load stored values on page load
document.addEventListener("DOMContentLoaded", () => {
    const batteryCapacityItem = localStorage.getItem("batteryCapacity");
    const chargingSpeedItem = localStorage.getItem("chargingSpeed");
    const currentChargeItem = localStorage.getItem("currentCharge");
    const desiredChargeItem = localStorage.getItem("desiredCharge");
    const chargeByTimeItem = localStorage.getItem("chargeByTime");

    if (batteryCapacityItem) (document.getElementById("batteryCapacity") as HTMLInputElement).value = batteryCapacityItem;
    if (chargingSpeedItem) (document.getElementById("chargingSpeed") as HTMLInputElement).value = chargingSpeedItem;
    if (currentChargeItem) (document.getElementById("currentCharge") as HTMLInputElement).value = currentChargeItem;
    if (desiredChargeItem) (document.getElementById("desiredCharge") as HTMLInputElement).value = desiredChargeItem;
    if (chargeByTimeItem) (document.getElementById("chargeByTime") as HTMLInputElement).value = chargeByTimeItem;

    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateCharging);
    }
});

// Calculate charging requirements
function calculateCharging() {
    // Gather inputs
    const batteryCapacity = parseFloat((document.getElementById("batteryCapacity") as HTMLInputElement).value);
    const chargingSpeed = parseFloat((document.getElementById("chargingSpeed") as HTMLInputElement).value);
    const currentCharge = parseFloat((document.getElementById("currentCharge") as HTMLInputElement).value);
    const desiredCharge = parseFloat((document.getElementById("desiredCharge") as HTMLInputElement).value);
    const chargeByTime = (document.getElementById("chargeByTime") as HTMLInputElement).value;

    // Validate inputs
    if (isNaN(batteryCapacity) || isNaN(chargingSpeed) || isNaN(currentCharge) || isNaN(desiredCharge) || !chargeByTime) {
        alert("Please fill out all fields correctly.");
        return;
    }

    // Calculate the charge required and time to achieve the target charge
    const requiredChargeKWh = ((desiredCharge - currentCharge) / 100) * batteryCapacity;
    const hoursRequired = requiredChargeKWh / chargingSpeed;

    // Parse the target time
    const [targetHour, targetMinute] = chargeByTime.split(":").map(Number);
    const targetDate = new Date();
    targetDate.setHours(targetHour, targetMinute, 0, 0);

    // Calculate plug-in time
    const plugInTime = new Date(targetDate.getTime() - hoursRequired * 60 * 60 * 1000);

    // Format results
    const hoursRequiredFormatted = hoursRequired.toFixed(2);
    const plugInTimeFormatted = plugInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Display results
    const totalKwhElem = document.getElementById("totalKwh");
    if (totalKwhElem) totalKwhElem.innerText = `Kwh: ${requiredChargeKWh.toFixed(2)}`;

    const hoursRequiredElem = document.getElementById("hoursRequired");
    if (hoursRequiredElem) hoursRequiredElem.innerText = `Hours Required: ${hoursRequiredFormatted}`;

    const plugInTimeElem = document.getElementById("plugInTime");
    if (plugInTimeElem) plugInTimeElem.innerText = `Plug-in Time: ${plugInTimeFormatted}`;

    // Store values in local storage
    localStorage.setItem("batteryCapacity", batteryCapacity.toString());
    localStorage.setItem("chargingSpeed", chargingSpeed.toString());
    localStorage.setItem("currentCharge", currentCharge.toString());
    localStorage.setItem("desiredCharge", desiredCharge.toString());
    localStorage.setItem("chargeByTime", chargeByTime);
}
