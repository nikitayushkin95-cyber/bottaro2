// Admin panel JavaScript
class AdminPanel {
    constructor() {
        this.apiBase = '/api/admin';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadStats();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.content-section');

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSection = button.dataset.section;
                
                // Update active nav button
                navButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show target section
                sections.forEach(section => section.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');
                
                // Load section data
                this.loadSectionData(targetSection);
            });
        });
    }

    async loadSectionData(section) {
        switch(section) {
            case 'stats':
                await this.loadStats();
                break;
            case 'payments':
                await this.loadPayments();
                break;
            case 'users':
                await this.loadUsers();
                break;
            case 'referrals':
                await this.loadReferrals();
                break;
        }
    }

    async loadStats() {
        try {
            this.showLoading();
            const response = await fetch(`${this.apiBase}/stats`);
            const data = await response.json();
            
            document.getElementById('totalUsers').textContent = data.total_users || 0;
            document.getElementById('totalReadings').textContent = data.total_readings || 0;
            document.getElementById('totalPayments').textContent = data.total_payments || 0;
            document.getElementById('totalReferrals').textContent = data.total_referrals || 0;
        } catch (error) {
            console.error('Error loading stats:', error);
            this.showError('Ошибка загрузки статистики');
        } finally {
            this.hideLoading();
        }
    }

    async loadPayments() {
        try {
            const filter = document.getElementById('paymentFilter').value;
            const response = await fetch(`${this.apiBase}/payments?filter=${filter}`);
            const data = await response.json();
            
            this.renderPayments(data.payments || []);
        } catch (error) {
            console.error('Error loading payments:', error);
            this.showError('Ошибка загрузки платежей');
        }
    }

    renderPayments(payments) {
        const container = document.getElementById('paymentsList');
        
        if (payments.length === 0) {
            container.innerHTML = '<div class="loading">Платежи не найдены</div>';
            return;
        }

        container.innerHTML = payments.map(payment => `
            <div class="payment-item">
                <div class="payment-info">
                    <div><strong>ID:</strong> ${payment.id}</div>
                    <div><strong>Пользователь:</strong> ${payment.user_id}</div>
                    <div><strong>Пакет:</strong> ${payment.package_name}</div>
                    <div><strong>Сумма:</strong> ${payment.amount}₽</div>
                    <div><strong>Статус:</strong> ${this.getStatusText(payment.status)}</div>
                    <div><strong>Дата:</strong> ${new Date(payment.created_at).toLocaleString()}</div>
                </div>
                <div class="payment-actions">
                    ${payment.status === 'pending' ? `
                        <button class="approve-btn" onclick="adminPanel.approvePayment(${payment.id})">
                            ✅ Одобрить
                        </button>
                        <button class="reject-btn" onclick="adminPanel.rejectPayment(${payment.id})">
                            ❌ Отклонить
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    async loadUsers() {
        try {
            const search = document.getElementById('userSearch').value;
            const response = await fetch(`${this.apiBase}/users?search=${search}`);
            const data = await response.json();
            
            this.renderUsers(data.users || []);
        } catch (error) {
            console.error('Error loading users:', error);
            this.showError('Ошибка загрузки пользователей');
        }
    }

    renderUsers(users) {
        const container = document.getElementById('usersList');
        
        if (users.length === 0) {
            container.innerHTML = '<div class="loading">Пользователи не найдены</div>';
            return;
        }

        container.innerHTML = users.map(user => `
            <div class="user-item">
                <div class="user-info">
                    <div><strong>ID:</strong> ${user.id}</div>
                    <div><strong>Имя:</strong> ${user.first_name || 'Не указано'}</div>
                    <div><strong>Username:</strong> @${user.username || 'Не указан'}</div>
                    <div><strong>Дата регистрации:</strong> ${new Date(user.created_at).toLocaleString()}</div>
                </div>
                <div class="user-stats">
                    <div>Раскладов: ${user.readings_count || 0}</div>
                    <div>Платежей: ${user.payments_count || 0}</div>
                    <div>Рефералов: ${user.referrals_count || 0}</div>
                </div>
            </div>
        `).join('');
    }

    async loadReferrals() {
        try {
            const response = await fetch(`${this.apiBase}/referrals`);
            const data = await response.json();
            
            this.renderReferrals(data.referrals || []);
        } catch (error) {
            console.error('Error loading referrals:', error);
            this.showError('Ошибка загрузки рефералов');
        }
    }

    renderReferrals(referrals) {
        const container = document.getElementById('referralsList');
        
        if (referrals.length === 0) {
            container.innerHTML = '<div class="loading">Рефералы не найдены</div>';
            return;
        }

        container.innerHTML = referrals.map(referral => `
            <div class="referral-item">
                <div><strong>Реферер:</strong> ${referral.referrer_id}</div>
                <div><strong>Реферал:</strong> ${referral.referred_id}</div>
                <div><strong>Статус:</strong> ${referral.status}</div>
                <div><strong>Дата:</strong> ${new Date(referral.created_at).toLocaleString()}</div>
            </div>
        `).join('');
    }

    async approvePayment(paymentId) {
        try {
            this.showLoading();
            const response = await fetch(`${this.apiBase}/payments/${paymentId}/approve`, {
                method: 'POST'
            });
            
            if (response.ok) {
                this.showSuccess('Платеж одобрен');
                this.loadPayments();
            } else {
                this.showError('Ошибка одобрения платежа');
            }
        } catch (error) {
            console.error('Error approving payment:', error);
            this.showError('Ошибка одобрения платежа');
        } finally {
            this.hideLoading();
        }
    }

    async rejectPayment(paymentId) {
        try {
            this.showLoading();
            const response = await fetch(`${this.apiBase}/payments/${paymentId}/reject`, {
                method: 'POST'
            });
            
            if (response.ok) {
                this.showSuccess('Платеж отклонен');
                this.loadPayments();
            } else {
                this.showError('Ошибка отклонения платежа');
            }
        } catch (error) {
            console.error('Error rejecting payment:', error);
            this.showError('Ошибка отклонения платежа');
        } finally {
            this.hideLoading();
        }
    }

    async sendBroadcast() {
        const message = document.getElementById('broadcastMessage').value;
        const includeInactive = document.getElementById('includeInactive').checked;
        
        if (!message.trim()) {
            this.showError('Введите сообщение для рассылки');
            return;
        }

        try {
            this.showLoading();
            const response = await fetch(`${this.apiBase}/broadcast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    include_inactive: includeInactive
                })
            });
            
            if (response.ok) {
                this.showSuccess('Рассылка отправлена');
                document.getElementById('broadcastMessage').value = '';
            } else {
                this.showError('Ошибка отправки рассылки');
            }
        } catch (error) {
            console.error('Error sending broadcast:', error);
            this.showError('Ошибка отправки рассылки');
        } finally {
            this.hideLoading();
        }
    }

    getStatusText(status) {
        const statusMap = {
            'pending': '⏳ Ожидает',
            'approved': '✅ Одобрен',
            'rejected': '❌ Отклонен'
        };
        return statusMap[status] || status;
    }

    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    showError(message) {
        alert(`❌ ${message}`);
    }

    showSuccess(message) {
        alert(`✅ ${message}`);
    }
}

// Global functions for HTML onclick handlers
window.loadStats = () => adminPanel.loadStats();
window.loadPayments = () => adminPanel.loadPayments();
window.loadUsers = () => adminPanel.loadUsers();
window.loadReferrals = () => adminPanel.loadReferrals();
window.sendBroadcast = () => adminPanel.sendBroadcast();

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});

// Setup search functionality
document.addEventListener('DOMContentLoaded', () => {
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        userSearch.addEventListener('input', () => {
            clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(() => {
                adminPanel.loadUsers();
            }, 500);
        });
    }

    const paymentFilter = document.getElementById('paymentFilter');
    if (paymentFilter) {
        paymentFilter.addEventListener('change', () => {
            adminPanel.loadPayments();
        });
    }
});
