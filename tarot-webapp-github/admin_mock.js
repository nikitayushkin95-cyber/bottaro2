// Admin panel JavaScript
class AdminPanel {
    constructor() {
        this.apiBase = '/api/admin';
        this.mockData = {
            stats: {
                total_users: 150,
                total_readings: 450,
                total_payments: 25,
                total_referrals: 12
            },
            payments: [
                {
                    id: 1,
                    user_id: 123456789,
                    package_name: '1 расклад',
                    amount: 199,
                    status: 'pending',
                    created_at: '2025-10-03T00:00:00Z',
                    screenshot_url: null
                },
                {
                    id: 2,
                    user_id: 987654321,
                    package_name: '5 раскладов',
                    amount: 699,
                    status: 'approved',
                    created_at: '2025-10-02T23:30:00Z',
                    screenshot_url: 'screenshot.jpg'
                },
                {
                    id: 3,
                    user_id: 555666777,
                    package_name: '1 месяц',
                    amount: 1990,
                    status: 'rejected',
                    created_at: '2025-10-01T20:15:00Z',
                    screenshot_url: 'payment_screenshot.jpg'
                }
            ],
            users: [
                {
                    id: 123456789,
                    first_name: 'Иван',
                    username: 'ivan_user',
                    created_at: '2025-10-01T10:00:00Z',
                    readings_count: 5,
                    payments_count: 2,
                    referrals_count: 1
                },
                {
                    id: 987654321,
                    first_name: 'Мария',
                    username: 'maria_user',
                    created_at: '2025-10-02T15:30:00Z',
                    readings_count: 3,
                    payments_count: 1,
                    referrals_count: 0
                },
                {
                    id: 555666777,
                    first_name: 'Алексей',
                    username: 'alex_user',
                    created_at: '2025-09-28T08:45:00Z',
                    readings_count: 8,
                    payments_count: 3,
                    referrals_count: 2
                },
                {
                    id: 111222333,
                    first_name: 'Елена',
                    username: 'elena_user',
                    created_at: '2025-10-03T00:00:00Z',
                    readings_count: 1,
                    payments_count: 0,
                    referrals_count: 0
                }
            ],
            referrals: [
                {
                    id: 1,
                    referrer_id: 123456789,
                    referred_id: 111222333,
                    status: 'active',
                    created_at: '2025-10-03T00:00:00Z'
                },
                {
                    id: 2,
                    referrer_id: 555666777,
                    referred_id: 999888777,
                    status: 'active',
                    created_at: '2025-10-02T14:20:00Z'
                }
            ]
        };
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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const data = this.mockData.stats;
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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));
            
            let payments = this.mockData.payments;
            if (filter !== 'all') {
                payments = payments.filter(p => p.status === filter);
            }
            
            this.renderPayments(payments);
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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));
            
            let users = this.mockData.users;
            if (search) {
                const searchLower = search.toLowerCase();
                users = users.filter(user => 
                    user.id.toString().includes(search) ||
                    (user.first_name && user.first_name.toLowerCase().includes(searchLower)) ||
                    (user.username && user.username.toLowerCase().includes(searchLower))
                );
            }
            
            this.renderUsers(users);
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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const data = this.mockData.referrals;
            this.renderReferrals(data);
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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update mock data
            const payment = this.mockData.payments.find(p => p.id === paymentId);
            if (payment) {
                payment.status = 'approved';
                this.showSuccess('Платеж одобрен');
                this.loadPayments();
            } else {
                this.showError('Платеж не найден');
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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update mock data
            const payment = this.mockData.payments.find(p => p.id === paymentId);
            if (payment) {
                payment.status = 'rejected';
                this.showSuccess('Платеж отклонен');
                this.loadPayments();
            } else {
                this.showError('Платеж не найден');
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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simulate broadcast
            const userCount = includeInactive ? this.mockData.stats.total_users : Math.floor(this.mockData.stats.total_users * 0.8);
            this.showSuccess(`Рассылка отправлена ${userCount} пользователям`);
            document.getElementById('broadcastMessage').value = '';
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
