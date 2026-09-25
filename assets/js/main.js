/**
 * Toronto EcoClean Solutions - Main Shared Interactive Script
 * Handles Navigation, Lucide Icons, Phone Masking, Cost Estimator, and Booking Form Validation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Sticky Header Elevation on Scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('shadow-md', 'bg-white/95', 'backdrop-blur-md');
                navbar.classList.remove('bg-white');
            } else {
                navbar.classList.remove('shadow-md', 'bg-white/95', 'backdrop-blur-md');
                navbar.classList.add('bg-white');
            }
        });
    }

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 4. Canadian Phone Masking ((416) XXX-XXXX)
    const phoneInput = document.getElementById('phone-input');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : `(${x[1]}) ${x[2]}` + (x[3] ? `-${x[3]}` : '');
        });
    }

    // 5. Instant Price Estimator (for contact.html / booking form)
    const serviceTypeSelect = document.getElementById('service-type');
    const bedroomsSelect = document.getElementById('bedrooms');
    const bathroomsSelect = document.getElementById('bathrooms');
    const frequencySelect = document.getElementById('frequency');
    const estimatedPriceEl = document.getElementById('estimated-price');
    const estimatedPriceMobileEl = document.getElementById('estimated-price-mobile');

    function calculateEstimate() {
        let basePrice = 120; // Default base price in CAD
        const serviceType = serviceTypeSelect ? serviceTypeSelect.value : 'residential';
        const bedrooms = bedroomsSelect ? parseInt(bedroomsSelect.value || 1) : 1;
        const bathrooms = bathroomsSelect ? parseInt(bathroomsSelect.value || 1) : 1;
        const frequency = frequencySelect ? frequencySelect.value : 'one-time';

        // Service modifier
        if (serviceType === 'deep-clean') basePrice = 180;
        else if (serviceType === 'move-in-out') basePrice = 240;
        else if (serviceType === 'commercial') basePrice = 200;

        // Room additions
        basePrice += (bedrooms - 1) * 25;
        basePrice += (bathrooms - 1) * 30;

        // Frequency discounts
        if (frequency === 'weekly') basePrice *= 0.80; // 20% discount
        else if (frequency === 'bi-weekly') basePrice *= 0.85; // 15% discount
        else if (frequency === 'monthly') basePrice *= 0.90; // 10% discount

        const formatted = `$${Math.round(basePrice)} CAD`;
        if (estimatedPriceEl) estimatedPriceEl.textContent = formatted;
        if (estimatedPriceMobileEl) estimatedPriceMobileEl.textContent = formatted;
    }

    if (serviceTypeSelect) serviceTypeSelect.addEventListener('change', calculateEstimate);
    if (bedroomsSelect) bedroomsSelect.addEventListener('change', calculateEstimate);
    if (bathroomsSelect) bathroomsSelect.addEventListener('change', calculateEstimate);
    if (frequencySelect) frequencySelect.addEventListener('change', calculateEstimate);
    calculateEstimate(); // initial calculation

    // 6. Booking Form Submission & Validation with Custom Toast/Modal
    const bookingForm = document.getElementById('booking-form');
    const modal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Perform simple HTML5 check
            if (!bookingForm.checkValidity()) {
                bookingForm.reportValidity();
                return;
            }

            // Retrieve values for personalization
            const fullName = document.getElementById('full-name')?.value || 'Valued Client';
            const clientEmail = document.getElementById('email-input')?.value || '';

            // Update modal text if elements exist
            const modalTitle = document.getElementById('modal-client-name');
            if (modalTitle) modalTitle.textContent = `Thank You, ${fullName}!`;

            const modalMsg = document.getElementById('modal-message');
            if (modalMsg) {
                modalMsg.textContent = `We have received your eco-cleaning request for Toronto & GTA. Confirmation sent to ${clientEmail || 'your email'}. Our team will contact you within 2 hours.`;
            }

            // Show Toast & Modal
            showToast('Estimate Request Submitted Successfully!');
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }

            // Reset Form
            bookingForm.reset();
            calculateEstimate();
        });
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
    }

    // Quick Toast Notification Utility
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border border-emerald-500/30 transform transition-all duration-300 translate-y-10 opacity-0';
        toast.innerHTML = `
            <div class="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div>
                <p class="font-semibold text-sm text-slate-100">${message}</p>
                <p class="text-xs text-slate-400">Toronto EcoClean Dispatch Team</p>
            </div>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        }, 10);

        setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
});
