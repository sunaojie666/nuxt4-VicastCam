const GENERAL_RESPONSE_CODES = {
  200001: ['operationSuccess', 'success'],
  200002: ['operationFailed', 'error'],
  200302: ['tooManyRequests', 'error'],
  200204: ['userCancelled', 'error'],
  200205: ['accountBanned', 'error'],
  200206: ['userNotFound', 'error'],
  200207: ['userStatusNotCancelled', 'error'],
  400001: ['requestFailed', 'error'],
  400200: ['invalidParameters', 'error'],
  400201: ['dataExists', 'error'],
  400202: ['dataNotFound', 'error'],
  400203: ['requiredField', 'error'],
  400204: ['productNotFound', 'error'],
  400205: ['productPriceInvalid', 'error'],
  400206: ['orderCurrencyInvalid', 'error'],
  400207: ['orderAmountMismatch', 'error'],
  400208: ['alreadyLifetimeMemberNoPurchase', 'error'],
  400209: ['sanctionedCountry', 'error'],
  400210: ['orderCurrencyMismatch', 'error'],
  400401: ['signatureError', 'error'],
  401001: ['unauthorized', 'error'],
  401200: ['sessionExpired', 'error'],
  401201: ['signedInElsewhere', 'error'],
  404001: ['pageNotFound', 'error'],
  405001: ['methodNotAllowed', 'error'],
  500001: ['serverError', 'error'],
  500002: ['systemMaintenance', 'error'],
  500003: ['cacheConfigError', 'error'],
  500004: ['cacheMiss', 'error'],
  500005: ['systemConfigError', 'error'],
  500006: ['paymentConfigError', 'error'],
  500007: ['serviceError', 'error'],
  500008: ['paymentOrderCreationFailed', 'error'],
  500101: ['registrationFailed', 'error'],
  500102: ['loginFailed', 'error'],
  500103: ['invalidCredentials', 'error'],
  500200: ['insufficientPoints', 'error'],
  500201: ['insufficientBalance', 'error'],
  500301: ['socialAccountBindingRequired', 'error'],
}

const SCOPED_RESPONSE_CODES = {
  auth: {
    200200: ['loginSuccess', 'success'],
    200201: ['loginFailed', 'error'],
    200202: ['logoutSuccess', 'success'],
    200203: ['logoutFailed', 'error'],
    200101: ['registrationSuccess', 'success'],
    200103: ['accountRegistered', 'error'],
    200106: ['inviteCodeExists', 'error'],
    200107: ['inviteCodeNotFound', 'error'],
    200108: ['invalidVerificationCode', 'error'],
    200109: ['mobileNotFound', 'error'],
    200114: ['inviteCodeAlreadySet', 'error'],
    200300: ['smsSent', 'success'],
    200303: ['smsFailed', 'error'],
    200305: ['emailSent', 'success'],
    200306: ['emailFailed', 'error'],
  },
  account: {
    200500: ['accountCancellationWithdrawn', 'success'],
    200501: ['accountCancelled', 'success'],
    200502: ['accountCancellationFailed', 'error'],
    200503: ['accountCancellationWithdrawnFailed', 'error'],
    200504: ['activeSubscriptionCancellationRequired', 'error'],
  },
  card: {
    200110: ['invalidCard', 'error'],
    200111: ['cardNotFound', 'error'],
    200112: ['cardDisabled', 'error'],
    200113: ['cardExpired', 'error'],
    200115: ['alreadyLifetimeMember', 'error'],
  },
  order: {
    200400: ['paymentSuccess', 'success'],
    200401: ['paymentFailed', 'error'],
    200402: ['orderNotFound', 'error'],
    200403: ['orderAlreadyPaid', 'error'],
    200404: ['orderExpired', 'error'],
    200405: ['orderCancelled', 'error'],
    200406: ['orderStatusError', 'error'],
    200407: ['duplicateSubscription', 'error'],
    200408: ['orderRefundedOrRevoked', 'success'],
  },
  orderRefund: {
    200408: ['orderRefunded', 'success'],
  },
  orderRevocation: {
    200408: ['orderRevoked', 'success'],
  },
  qr: {
    200200: ['loginSuccess', 'success'],
    2100005: ['missingParameters', 'error'],
    2100006: ['waitingForScan', 'pending'],
    2100007: ['scannedWaitingForConfirmation', 'pending'],
    2100008: ['qrCodeExpired', 'error'],
  },
  dataDownload: {
    200310: ['downloadCodeSent', 'success'],
    200311: ['downloadCodeInvalid', 'error'],
    200312: ['downloadRecordNotFound', 'error'],
  },
}

export const API_RESPONSE_MESSAGES = {
  'zh-CN': {
    operationSuccess: '操作成功', operationFailed: '操作失败', tooManyRequests: '操作频繁，请稍后重试',
    requestFailed: '请求失败', invalidParameters: '参数错误', requiredField: '必填字段不能为空', dataExists: '数据已存在', dataNotFound: '数据不存在',
    unauthorized: '授权失败，请先登录', sessionExpired: '账号信息已过期，请重新登录', signedInElsewhere: '账号已在其他设备登录，请重新登录', pageNotFound: '没有找到该页面', methodNotAllowed: 'HTTP 请求类型错误',
    serverError: '服务器错误', systemMaintenance: '服务器正在维护，暂不可用', cacheConfigError: '缓存配置错误', cacheMiss: '缓存未命中', systemConfigError: '系统配置错误', paymentConfigError: '支付接口未配置', serviceError: '服务异常', paymentOrderCreationFailed: '支付订单创建失败',
    registrationFailed: '注册失败', loginFailed: '登录失败', invalidCredentials: '账号或密码错误', insufficientPoints: '积分不足', insufficientBalance: '余额不足', socialAccountBindingRequired: '社交账号需验证绑定',
    loginSuccess: '登录成功', logoutSuccess: '退出登录成功', logoutFailed: '退出登录失败', registrationSuccess: '注册成功', accountRegistered: '账号已注册', inviteCodeExists: '邀请码已存在', inviteCodeNotFound: '邀请码不存在', invalidVerificationCode: '验证码不正确', mobileNotFound: '手机号不存在', inviteCodeAlreadySet: '已经填写过邀请码', smsSent: '短信发送成功', smsFailed: '短信发送失败', emailSent: '邮件发送成功', emailFailed: '邮件发送失败',
    accountCancellationWithdrawn: '撤回注销成功', accountCancelled: '账号注销成功', accountCancellationFailed: '账号注销失败',
    invalidCard: '卡密不存在或已激活', cardNotFound: '卡密不存在', cardDisabled: '卡密已封停', cardExpired: '卡密已过期', alreadyLifetimeMember: '已开通终身卡，无法继续激活其他卡', alreadyLifetimeMemberNoPurchase: '已是终身会员，无需继续购买', productNotFound: '商品不存在', productPriceInvalid: '商品价格未配置', orderCurrencyInvalid: '订单币种非法', orderAmountMismatch: '支付金额与订单金额不匹配', sanctionedCountry: '该地区暂不支持购买服务', orderCurrencyMismatch: '支付币种与订单币种不匹配',
    paymentSuccess: '订单支付成功', paymentFailed: '订单支付失败', orderNotFound: '订单不存在', orderAlreadyPaid: '订单已支付', orderExpired: '订单已过期', orderCancelled: '订单已取消', orderStatusError: '订单状态异常', duplicateSubscription: '订单重复订阅', orderRefundedOrRevoked: '订单已退款或撤销', orderRefunded: '订单退款成功', orderRevoked: '订单已撤销',
    missingParameters: '缺少参数', waitingForScan: '等待扫码', scannedWaitingForConfirmation: '已扫码，等待确认', qrCodeExpired: '二维码已过期',
    downloadCodeSent: '验证码已发送', downloadCodeInvalid: '验证码无效或已过期', downloadRecordNotFound: '未找到下载记录', userCancelled: '该用户已注销', accountBanned: '账号已被封禁，请联系客服', userNotFound: '用户不存在', userStatusNotCancelled: '用户状态非注销', signatureError: '签名错误', accountCancellationWithdrawnFailed: '账号注销撤回失败', activeSubscriptionCancellationRequired: '存在未取消的订阅，请先在对应平台取消订阅后再注销',
  },
  'zh-TW': {
    operationSuccess: '操作成功', operationFailed: '操作失敗', tooManyRequests: '操作頻繁，請稍後重試',
    requestFailed: '請求失敗', invalidParameters: '參數錯誤', requiredField: '必填欄位不能為空', dataExists: '資料已存在', dataNotFound: '資料不存在',
    unauthorized: '授權失敗，請先登入', sessionExpired: '帳號資訊已過期，請重新登入', signedInElsewhere: '帳號已在其他裝置登入，請重新登入', pageNotFound: '找不到該頁面', methodNotAllowed: 'HTTP 請求類型錯誤',
    serverError: '伺服器錯誤', systemMaintenance: '伺服器維護中，暫時無法使用', cacheConfigError: '快取設定錯誤', cacheMiss: '快取未命中', systemConfigError: '系統設定錯誤', paymentConfigError: '付款介面未設定', serviceError: '服務異常', paymentOrderCreationFailed: '建立付款訂單失敗',
    registrationFailed: '註冊失敗', loginFailed: '登入失敗', invalidCredentials: '帳號或密碼錯誤', insufficientPoints: '積分不足', insufficientBalance: '餘額不足', socialAccountBindingRequired: '社交帳號需要驗證綁定',
    loginSuccess: '登入成功', logoutSuccess: '登出成功', logoutFailed: '登出失敗', registrationSuccess: '註冊成功', accountRegistered: '帳號已註冊', inviteCodeExists: '邀請碼已存在', inviteCodeNotFound: '邀請碼不存在', invalidVerificationCode: '驗證碼不正確', mobileNotFound: '手機號碼不存在', inviteCodeAlreadySet: '已經填寫過邀請碼', smsSent: '簡訊傳送成功', smsFailed: '簡訊傳送失敗', emailSent: '郵件傳送成功', emailFailed: '郵件傳送失敗',
    accountCancellationWithdrawn: '撤回註銷成功', accountCancelled: '帳號註銷成功', accountCancellationFailed: '帳號註銷失敗',
    invalidCard: '卡密不存在或已啟動', cardNotFound: '卡密不存在', cardDisabled: '卡密已停用', cardExpired: '卡密已過期', alreadyLifetimeMember: '已開通終身卡，無法繼續啟動其他卡', alreadyLifetimeMemberNoPurchase: '已是終身會員，無需繼續購買', productNotFound: '商品不存在', productPriceInvalid: '商品價格未設定', orderCurrencyInvalid: '訂單幣別不合法', orderAmountMismatch: '支付金額與訂單金額不匹配', sanctionedCountry: '該地區暫不支援購買服務', orderCurrencyMismatch: '支付幣別與訂單幣別不匹配',
    paymentSuccess: '訂單付款成功', paymentFailed: '訂單付款失敗', orderNotFound: '訂單不存在', orderAlreadyPaid: '訂單已付款', orderExpired: '訂單已過期', orderCancelled: '訂單已取消', orderStatusError: '訂單狀態異常', duplicateSubscription: '訂單重複訂閱', orderRefundedOrRevoked: '訂單已退款或撤銷', orderRefunded: '訂單退款成功', orderRevoked: '訂單已撤銷',
    missingParameters: '缺少參數', waitingForScan: '等待掃碼', scannedWaitingForConfirmation: '已掃碼，等待確認', qrCodeExpired: '二維碼已過期',
    downloadCodeSent: '驗證碼已傳送', downloadCodeInvalid: '驗證碼無效或已過期', downloadRecordNotFound: '找不到下載記錄', userCancelled: '該用戶已註銷', accountBanned: '帳號已被封鎖，請聯繫客服', userNotFound: '用戶不存在', userStatusNotCancelled: '用戶狀態非註銷', signatureError: '簽名錯誤', accountCancellationWithdrawnFailed: '帳號註銷撤回失敗', activeSubscriptionCancellationRequired: '存在未取消的訂閱，請先在對應平台取消訂閱後再註銷',
  },
  en: {
    operationSuccess: 'Operation completed successfully', operationFailed: 'Operation failed', tooManyRequests: 'Too many attempts. Please try again later',
    requestFailed: 'Request failed', invalidParameters: 'Invalid parameters', requiredField: 'Required fields cannot be empty', dataExists: 'Data already exists', dataNotFound: 'Data not found',
    unauthorized: 'Authorization failed. Please sign in', sessionExpired: 'Your session has expired. Please sign in again', signedInElsewhere: 'Your account was signed in on another device. Please sign in again', pageNotFound: 'Page not found', methodNotAllowed: 'HTTP method not allowed',
    serverError: 'Server error', systemMaintenance: 'The server is under maintenance and temporarily unavailable', cacheConfigError: 'Cache configuration error', cacheMiss: 'Cache miss', systemConfigError: 'System configuration error', paymentConfigError: 'Payment service is not configured', serviceError: 'Service error', paymentOrderCreationFailed: 'Failed to create payment order',
    registrationFailed: 'Registration failed', loginFailed: 'Login failed', invalidCredentials: 'Incorrect account or password', insufficientPoints: 'Insufficient points', insufficientBalance: 'Insufficient balance', socialAccountBindingRequired: 'Please verify and link your social account',
    loginSuccess: 'Logged in successfully', logoutSuccess: 'Logged out successfully', logoutFailed: 'Logout failed', registrationSuccess: 'Registered successfully', accountRegistered: 'This account is already registered', inviteCodeExists: 'Invite code already exists', inviteCodeNotFound: 'Invite code not found', invalidVerificationCode: 'Incorrect verification code', mobileNotFound: 'Mobile number not found', inviteCodeAlreadySet: 'An invite code has already been entered', smsSent: 'SMS sent successfully', smsFailed: 'Failed to send SMS', emailSent: 'Email sent successfully', emailFailed: 'Failed to send email',
    accountCancellationWithdrawn: 'Account cancellation withdrawn successfully', accountCancelled: 'Account cancelled successfully', accountCancellationFailed: 'Account cancellation failed',
    invalidCard: 'Activation code not found or already activated', cardNotFound: 'Activation code not found', cardDisabled: 'Activation code has been disabled', cardExpired: 'Activation code has expired', alreadyLifetimeMember: 'You already have a lifetime membership and cannot activate other cards', alreadyLifetimeMemberNoPurchase: 'You are already a lifetime member. There is no need to purchase again', productNotFound: 'Product not found', productPriceInvalid: 'Product price is not configured', orderCurrencyInvalid: 'Invalid order currency', orderAmountMismatch: 'Payment amount does not match the order amount', sanctionedCountry: 'Purchases are not available in your region', orderCurrencyMismatch: 'Payment currency does not match the order currency',
    paymentSuccess: 'Payment completed successfully', paymentFailed: 'Payment failed', orderNotFound: 'Order not found', orderAlreadyPaid: 'Order already paid', orderExpired: 'Order expired', orderCancelled: 'Order cancelled', orderStatusError: 'Invalid order status', duplicateSubscription: 'Duplicate subscription order', orderRefundedOrRevoked: 'Order refunded or revoked', orderRefunded: 'Order refunded successfully', orderRevoked: 'Order revoked',
    missingParameters: 'Missing parameters', waitingForScan: 'Waiting to scan', scannedWaitingForConfirmation: 'Scanned. Waiting for confirmation', qrCodeExpired: 'QR code expired',
    downloadCodeSent: 'Verification code sent', downloadCodeInvalid: 'Verification code is invalid or expired', downloadRecordNotFound: 'No download record found', userCancelled: 'This user has been cancelled', accountBanned: 'Your account has been banned. Please contact customer support', userNotFound: 'User not found', userStatusNotCancelled: 'This account has not been cancelled', signatureError: 'Signature verification failed', accountCancellationWithdrawnFailed: 'Failed to withdraw the account cancellation', activeSubscriptionCancellationRequired: 'You have an active subscription. Please cancel it on the relevant platform before cancelling your account',
  },
  id: {
    operationSuccess: 'Operasi berhasil', operationFailed: 'Operasi gagal', tooManyRequests: 'Terlalu banyak percobaan. Coba lagi nanti',
    requestFailed: 'Permintaan gagal', invalidParameters: 'Parameter tidak valid', requiredField: 'Kolom wajib tidak boleh kosong', dataExists: 'Data sudah ada', dataNotFound: 'Data tidak ditemukan',
    unauthorized: 'Otorisasi gagal. Silakan masuk', sessionExpired: 'Sesi Anda telah berakhir. Silakan masuk kembali', signedInElsewhere: 'Akun Anda masuk di perangkat lain. Silakan masuk kembali', pageNotFound: 'Halaman tidak ditemukan', methodNotAllowed: 'Metode HTTP tidak diizinkan',
    serverError: 'Kesalahan server', systemMaintenance: 'Server sedang dalam pemeliharaan dan sementara tidak tersedia', cacheConfigError: 'Kesalahan konfigurasi cache', cacheMiss: 'Cache tidak ditemukan', systemConfigError: 'Kesalahan konfigurasi sistem', paymentConfigError: 'Layanan pembayaran belum dikonfigurasi', serviceError: 'Kesalahan layanan', paymentOrderCreationFailed: 'Gagal membuat pesanan pembayaran',
    registrationFailed: 'Pendaftaran gagal', loginFailed: 'Gagal masuk', invalidCredentials: 'Akun atau kata sandi salah', insufficientPoints: 'Poin tidak mencukupi', insufficientBalance: 'Saldo tidak mencukupi', socialAccountBindingRequired: 'Verifikasi dan tautkan akun sosial Anda',
    loginSuccess: 'Berhasil masuk', logoutSuccess: 'Berhasil keluar', logoutFailed: 'Gagal keluar', registrationSuccess: 'Pendaftaran berhasil', accountRegistered: 'Akun ini sudah terdaftar', inviteCodeExists: 'Kode undangan sudah ada', inviteCodeNotFound: 'Kode undangan tidak ditemukan', invalidVerificationCode: 'Kode verifikasi salah', mobileNotFound: 'Nomor ponsel tidak ditemukan', inviteCodeAlreadySet: 'Kode undangan sudah pernah dimasukkan', smsSent: 'SMS berhasil dikirim', smsFailed: 'Gagal mengirim SMS', emailSent: 'Email berhasil dikirim', emailFailed: 'Gagal mengirim email',
    accountCancellationWithdrawn: 'Pembatalan akun berhasil ditarik', accountCancelled: 'Akun berhasil dibatalkan', accountCancellationFailed: 'Pembatalan akun gagal',
    invalidCard: 'Kode aktivasi tidak ditemukan atau sudah diaktifkan', cardNotFound: 'Kode aktivasi tidak ditemukan', cardDisabled: 'Kode aktivasi telah dinonaktifkan', cardExpired: 'Kode aktivasi telah kedaluwarsa', alreadyLifetimeMember: 'Anda sudah memiliki keanggotaan seumur hidup dan tidak dapat mengaktifkan kartu lain', alreadyLifetimeMemberNoPurchase: 'Anda sudah menjadi anggota seumur hidup. Tidak perlu membeli lagi', productNotFound: 'Produk tidak ditemukan', productPriceInvalid: 'Harga produk belum dikonfigurasi', orderCurrencyInvalid: 'Mata uang pesanan tidak valid', orderAmountMismatch: 'Jumlah pembayaran tidak cocok dengan jumlah pesanan', sanctionedCountry: 'Pembelian tidak tersedia di wilayah Anda', orderCurrencyMismatch: 'Mata uang pembayaran tidak cocok dengan mata uang pesanan',
    paymentSuccess: 'Pembayaran berhasil', paymentFailed: 'Pembayaran gagal', orderNotFound: 'Pesanan tidak ditemukan', orderAlreadyPaid: 'Pesanan sudah dibayar', orderExpired: 'Pesanan telah kedaluwarsa', orderCancelled: 'Pesanan dibatalkan', orderStatusError: 'Status pesanan tidak valid', duplicateSubscription: 'Pesanan langganan duplikat', orderRefundedOrRevoked: 'Pesanan telah dikembalikan dananya atau dicabut', orderRefunded: 'Pengembalian dana pesanan berhasil', orderRevoked: 'Pesanan telah dicabut',
    missingParameters: 'Parameter tidak lengkap', waitingForScan: 'Menunggu pemindaian', scannedWaitingForConfirmation: 'Sudah dipindai. Menunggu konfirmasi', qrCodeExpired: 'Kode QR telah kedaluwarsa',
    downloadCodeSent: 'Kode verifikasi telah dikirim', downloadCodeInvalid: 'Kode verifikasi tidak valid atau telah kedaluwarsa', downloadRecordNotFound: 'Riwayat unduhan tidak ditemukan', userCancelled: 'Pengguna ini telah dibatalkan', accountBanned: 'Akun Anda telah diblokir. Silakan hubungi layanan pelanggan', userNotFound: 'Pengguna tidak ditemukan', userStatusNotCancelled: 'Status akun tidak dibatalkan', signatureError: 'Kesalahan tanda tangan', accountCancellationWithdrawnFailed: 'Gagal menarik pembatalan akun', activeSubscriptionCancellationRequired: 'Anda memiliki langganan aktif. Silakan batalkan langganan di platform terkait sebelum membatalkan akun',
  },
  ms: {
    operationSuccess: 'Operasi berjaya', operationFailed: 'Operasi gagal', tooManyRequests: 'Terlalu banyak percubaan. Cuba lagi kemudian',
    requestFailed: 'Permintaan gagal', invalidParameters: 'Parameter tidak sah', requiredField: 'Medan wajib tidak boleh kosong', dataExists: 'Data sudah wujud', dataNotFound: 'Data tidak ditemukan',
    unauthorized: 'Pengesahan gagal. Sila log masuk', sessionExpired: 'Sesi anda telah tamat. Sila log masuk semula', signedInElsewhere: 'Akaun anda telah log masuk pada peranti lain. Sila log masuk semula', pageNotFound: 'Halaman tidak ditemukan', methodNotAllowed: 'Kaedah HTTP tidak dibenarkan',
    serverError: 'Ralat pelayan', systemMaintenance: 'Pelayan sedang diselenggara dan tidak tersedia buat sementara waktu', cacheConfigError: 'Ralat konfigurasi cache', cacheMiss: 'Cache tidak ditemukan', systemConfigError: 'Ralat konfigurasi sistem', paymentConfigError: 'Perkhidmatan pembayaran belum dikonfigurasi', serviceError: 'Ralat perkhidmatan', paymentOrderCreationFailed: 'Gagal mencipta pesanan pembayaran',
    registrationFailed: 'Pendaftaran gagal', loginFailed: 'Log masuk gagal', invalidCredentials: 'Akaun atau kata laluan salah', insufficientPoints: 'Mata tidak mencukupi', insufficientBalance: 'Baki tidak mencukupi', socialAccountBindingRequired: 'Sila sahkan dan pautkan akaun sosial anda',
    loginSuccess: 'Berjaya log masuk', logoutSuccess: 'Berjaya log keluar', logoutFailed: 'Log keluar gagal', registrationSuccess: 'Pendaftaran berjaya', accountRegistered: 'Akaun ini sudah didaftarkan', inviteCodeExists: 'Kod jemputan sudah wujud', inviteCodeNotFound: 'Kod jemputan tidak ditemukan', invalidVerificationCode: 'Kod pengesahan salah', mobileNotFound: 'Nombor telefon tidak ditemukan', inviteCodeAlreadySet: 'Kod jemputan telah dimasukkan', smsSent: 'SMS berjaya dihantar', smsFailed: 'Gagal menghantar SMS', emailSent: 'E-mel berjaya dihantar', emailFailed: 'Gagal menghantar e-mel',
    accountCancellationWithdrawn: 'Pembatalan akaun berjaya ditarik balik', accountCancelled: 'Akaun berjaya dibatalkan', accountCancellationFailed: 'Pembatalan akaun gagal',
    invalidCard: 'Kod pengaktifan tidak ditemukan atau telah diaktifkan', cardNotFound: 'Kod pengaktifan tidak ditemukan', cardDisabled: 'Kod pengaktifan telah dinyahaktifkan', cardExpired: 'Kod pengaktifan telah tamat tempoh', alreadyLifetimeMember: 'Anda sudah mempunyai keahlian seumur hidup dan tidak boleh mengaktifkan kad lain', alreadyLifetimeMemberNoPurchase: 'Anda sudah menjadi ahli seumur hidup. Tidak perlu membeli lagi', productNotFound: 'Produk tidak ditemui', productPriceInvalid: 'Harga produk belum dikonfigurasikan', orderCurrencyInvalid: 'Mata wang pesanan tidak sah', orderAmountMismatch: 'Jumlah pembayaran tidak sepadan dengan jumlah pesanan', sanctionedCountry: 'Pembelian tidak tersedia di wilayah anda', orderCurrencyMismatch: 'Mata wang pembayaran tidak sepadan dengan mata wang pesanan',
    paymentSuccess: 'Pembayaran berjaya', paymentFailed: 'Pembayaran gagal', orderNotFound: 'Pesanan tidak ditemukan', orderAlreadyPaid: 'Pesanan telah dibayar', orderExpired: 'Pesanan telah tamat tempoh', orderCancelled: 'Pesanan dibatalkan', orderStatusError: 'Status pesanan tidak sah', duplicateSubscription: 'Pesanan langganan berulang', orderRefundedOrRevoked: 'Pesanan telah dibayar balik atau dibatalkan', orderRefunded: 'Bayaran balik pesanan berjaya', orderRevoked: 'Pesanan telah dibatalkan',
    missingParameters: 'Parameter tidak lengkap', waitingForScan: 'Menunggu imbasan', scannedWaitingForConfirmation: 'Telah diimbas. Menunggu pengesahan', qrCodeExpired: 'Kod QR telah tamat tempoh',
    downloadCodeSent: 'Kod pengesahan telah dihantar', downloadCodeInvalid: 'Kod pengesahan tidak sah atau telah tamat tempoh', downloadRecordNotFound: 'Rekod muat turun tidak ditemukan', userCancelled: 'Pengguna ini telah dibatalkan', accountBanned: 'Akaun anda telah disekat. Sila hubungi khidmat pelanggan', userNotFound: 'Pengguna tidak ditemukan', userStatusNotCancelled: 'Status akaun tidak dibatalkan', signatureError: 'Ralat tandatangan', accountCancellationWithdrawnFailed: 'Gagal menarik balik pembatalan akaun', activeSubscriptionCancellationRequired: 'Anda mempunyai langganan aktif. Sila batalkan langganan di platform berkaitan sebelum membatalkan akaun',
  },
  th: {
    operationSuccess: 'ดำเนินการสำเร็จ', operationFailed: 'ดำเนินการไม่สำเร็จ', tooManyRequests: 'ดำเนินการบ่อยเกินไป โปรดลองอีกครั้งภายหลัง',
    requestFailed: 'คำขอล้มเหลว', invalidParameters: 'พารามิเตอร์ไม่ถูกต้อง', requiredField: 'ต้องกรอกข้อมูลในช่องที่จำเป็น', dataExists: 'มีข้อมูลนี้อยู่แล้ว', dataNotFound: 'ไม่พบข้อมูล',
    unauthorized: 'การยืนยันสิทธิ์ล้มเหลว โปรดเข้าสู่ระบบ', sessionExpired: 'เซสชันหมดอายุ โปรดเข้าสู่ระบบอีกครั้ง', signedInElsewhere: 'บัญชีของคุณเข้าสู่ระบบบนอุปกรณ์อื่น โปรดเข้าสู่ระบบอีกครั้ง', pageNotFound: 'ไม่พบหน้านี้', methodNotAllowed: 'ไม่อนุญาตวิธี HTTP นี้',
    serverError: 'เซิร์ฟเวอร์ขัดข้อง', systemMaintenance: 'เซิร์ฟเวอร์อยู่ระหว่างการบำรุงรักษาและไม่พร้อมใช้งานชั่วคราว', cacheConfigError: 'การกำหนดค่าแคชผิดพลาด', cacheMiss: 'ไม่พบแคช', systemConfigError: 'การกำหนดค่าระบบผิดพลาด', paymentConfigError: 'ยังไม่ได้กำหนดค่าบริการชำระเงิน', serviceError: 'ข้อผิดพลาดของบริการ', paymentOrderCreationFailed: 'ไม่สามารถสร้างคำสั่งซื้อการชำระเงินได้',
    registrationFailed: 'ลงทะเบียนไม่สำเร็จ', loginFailed: 'เข้าสู่ระบบไม่สำเร็จ', invalidCredentials: 'บัญชีหรือรหัสผ่านไม่ถูกต้อง', insufficientPoints: 'คะแนนไม่เพียงพอ', insufficientBalance: 'ยอดคงเหลือไม่เพียงพอ', socialAccountBindingRequired: 'โปรดยืนยันและเชื่อมโยงบัญชีโซเชียล',
    loginSuccess: 'เข้าสู่ระบบสำเร็จ', logoutSuccess: 'ออกจากระบบสำเร็จ', logoutFailed: 'ออกจากระบบไม่สำเร็จ', registrationSuccess: 'ลงทะเบียนสำเร็จ', accountRegistered: 'บัญชีนี้ลงทะเบียนแล้ว', inviteCodeExists: 'มีรหัสเชิญนี้อยู่แล้ว', inviteCodeNotFound: 'ไม่พบรหัสเชิญ', invalidVerificationCode: 'รหัสยืนยันไม่ถูกต้อง', mobileNotFound: 'ไม่พบหมายเลขโทรศัพท์', inviteCodeAlreadySet: 'กรอกรหัสเชิญแล้ว', smsSent: 'ส่ง SMS สำเร็จ', smsFailed: 'ส่ง SMS ไม่สำเร็จ', emailSent: 'ส่งอีเมลสำเร็จ', emailFailed: 'ส่งอีเมลไม่สำเร็จ',
    accountCancellationWithdrawn: 'ถอนคำขอยกเลิกบัญชีสำเร็จ', accountCancelled: 'ยกเลิกบัญชีสำเร็จ', accountCancellationFailed: 'ยกเลิกบัญชีไม่สำเร็จ',
    invalidCard: 'ไม่พบรหัสเปิดใช้งานหรือเปิดใช้งานแล้ว', cardNotFound: 'ไม่พบรหัสเปิดใช้งาน', cardDisabled: 'รหัสเปิดใช้งานถูกระงับ', cardExpired: 'รหัสเปิดใช้งานหมดอายุ', alreadyLifetimeMember: 'คุณมีสมาชิกภาพตลอดชีพอยู่แล้ว ไม่สามารถเปิดใช้งานการ์ดอื่นได้', alreadyLifetimeMemberNoPurchase: 'คุณเป็นสมาชิกตลอดชีพอยู่แล้ว ไม่จำเป็นต้องซื้ออีก', productNotFound: 'ไม่พบสินค้า', productPriceInvalid: 'ยังไม่ได้กำหนดราคาสินค้า', orderCurrencyInvalid: 'สกุลเงินของคำสั่งซื้อไม่ถูกต้อง', orderAmountMismatch: 'ยอดชำระเงินไม่ตรงกับยอดคำสั่งซื้อ', sanctionedCountry: 'ไม่รองรับการซื้อในภูมิภาคนี้', orderCurrencyMismatch: 'สกุลเงินการชำระเงินไม่ตรงกับสกุลเงินของคำสั่งซื้อ',
    paymentSuccess: 'ชำระเงินสำเร็จ', paymentFailed: 'ชำระเงินไม่สำเร็จ', orderNotFound: 'ไม่พบคำสั่งซื้อ', orderAlreadyPaid: 'ชำระคำสั่งซื้อแล้ว', orderExpired: 'คำสั่งซื้อหมดอายุ', orderCancelled: 'ยกเลิกคำสั่งซื้อแล้ว', orderStatusError: 'สถานะคำสั่งซื้อไม่ถูกต้อง', duplicateSubscription: 'มีคำสั่งซื้อการสมัครสมาชิกซ้ำ', orderRefundedOrRevoked: 'คืนเงินหรือเพิกถอนคำสั่งซื้อแล้ว', orderRefunded: 'คืนเงินคำสั่งซื้อสำเร็จ', orderRevoked: 'เพิกถอนคำสั่งซื้อแล้ว',
    missingParameters: 'พารามิเตอร์ไม่ครบ', waitingForScan: 'รอการสแกน', scannedWaitingForConfirmation: 'สแกนแล้ว รอการยืนยัน', qrCodeExpired: 'คิวอาร์โค้ดหมดอายุ',
    downloadCodeSent: 'ส่งรหัสยืนยันแล้ว', downloadCodeInvalid: 'รหัสยืนยันไม่ถูกต้องหรือหมดอายุ', downloadRecordNotFound: 'ไม่พบประวัติการดาวน์โหลด', userCancelled: 'ผู้ใช้นี้ถูกยกเลิกแล้ว', accountBanned: 'บัญชีของคุณถูกระงับ กรุณาติดต่อฝ่ายบริการลูกค้า', userNotFound: 'ไม่พบผู้ใช้', userStatusNotCancelled: 'สถานะบัญชีไม่ได้ถูกยกเลิก', signatureError: 'ข้อผิดพลาดลายเซ็น', accountCancellationWithdrawnFailed: 'ไม่สามารถถอนคำขอยกเลิกบัญชีได้', activeSubscriptionCancellationRequired: 'คุณมีการสมัครสมาชิกที่ยังใช้งานอยู่ กรุณายกเลิกการสมัครบนแพลตฟอร์มที่เกี่ยวข้องก่อนยกเลิกบัญชี',
  },
  vi: {
    operationSuccess: 'Thao tác thành công', operationFailed: 'Thao tác thất bại', tooManyRequests: 'Thao tác quá thường xuyên. Vui lòng thử lại sau',
    requestFailed: 'Yêu cầu thất bại', invalidParameters: 'Tham số không hợp lệ', requiredField: 'Không được để trống trường bắt buộc', dataExists: 'Dữ liệu đã tồn tại', dataNotFound: 'Không tìm thấy dữ liệu',
    unauthorized: 'Xác thực thất bại. Vui lòng đăng nhập', sessionExpired: 'Phiên đã hết hạn. Vui lòng đăng nhập lại', signedInElsewhere: 'Tài khoản đã đăng nhập trên thiết bị khác. Vui lòng đăng nhập lại', pageNotFound: 'Không tìm thấy trang', methodNotAllowed: 'Phương thức HTTP không được phép',
    serverError: 'Lỗi máy chủ', systemMaintenance: 'Máy chủ đang bảo trì và tạm thời không khả dụng', cacheConfigError: 'Lỗi cấu hình bộ nhớ đệm', cacheMiss: 'Không tìm thấy bộ nhớ đệm', systemConfigError: 'Lỗi cấu hình hệ thống', paymentConfigError: 'Dịch vụ thanh toán chưa được cấu hình', serviceError: 'Lỗi dịch vụ', paymentOrderCreationFailed: 'Không thể tạo đơn thanh toán',
    registrationFailed: 'Đăng ký thất bại', loginFailed: 'Đăng nhập thất bại', invalidCredentials: 'Tài khoản hoặc mật khẩu không đúng', insufficientPoints: 'Không đủ điểm', insufficientBalance: 'Số dư không đủ', socialAccountBindingRequired: 'Vui lòng xác minh và liên kết tài khoản mạng xã hội',
    loginSuccess: 'Đăng nhập thành công', logoutSuccess: 'Đăng xuất thành công', logoutFailed: 'Đăng xuất thất bại', registrationSuccess: 'Đăng ký thành công', accountRegistered: 'Tài khoản này đã được đăng ký', inviteCodeExists: 'Mã mời đã tồn tại', inviteCodeNotFound: 'Không tìm thấy mã mời', invalidVerificationCode: 'Mã xác minh không đúng', mobileNotFound: 'Không tìm thấy số điện thoại', inviteCodeAlreadySet: 'Mã mời đã được nhập', smsSent: 'Gửi SMS thành công', smsFailed: 'Gửi SMS thất bại', emailSent: 'Gửi email thành công', emailFailed: 'Gửi email thất bại',
    accountCancellationWithdrawn: 'Rút yêu cầu hủy tài khoản thành công', accountCancelled: 'Hủy tài khoản thành công', accountCancellationFailed: 'Hủy tài khoản thất bại',
    invalidCard: 'Không tìm thấy mã kích hoạt hoặc mã đã được kích hoạt', cardNotFound: 'Không tìm thấy mã kích hoạt', cardDisabled: 'Mã kích hoạt đã bị vô hiệu hóa', cardExpired: 'Mã kích hoạt đã hết hạn', alreadyLifetimeMember: 'Bạn đã có gói thành viên trọn đời và không thể kích hoạt thẻ khác', alreadyLifetimeMemberNoPurchase: 'Bạn đã là thành viên trọn đời. Không cần mua thêm', productNotFound: 'Không tìm thấy sản phẩm', productPriceInvalid: 'Giá sản phẩm chưa được cấu hình', orderCurrencyInvalid: 'Loại tiền tệ của đơn hàng không hợp lệ', orderAmountMismatch: 'Số tiền thanh toán không khớp với số tiền đơn hàng', sanctionedCountry: 'Không hỗ trợ mua hàng tại khu vực này', orderCurrencyMismatch: 'Loại tiền thanh toán không khớp với loại tiền của đơn hàng',
    paymentSuccess: 'Thanh toán thành công', paymentFailed: 'Thanh toán thất bại', orderNotFound: 'Không tìm thấy đơn hàng', orderAlreadyPaid: 'Đơn hàng đã được thanh toán', orderExpired: 'Đơn hàng đã hết hạn', orderCancelled: 'Đơn hàng đã bị hủy', orderStatusError: 'Trạng thái đơn hàng không hợp lệ', duplicateSubscription: 'Đơn đăng ký bị trùng', orderRefundedOrRevoked: 'Đơn hàng đã được hoàn tiền hoặc thu hồi', orderRefunded: 'Hoàn tiền đơn hàng thành công', orderRevoked: 'Đơn hàng đã bị thu hồi',
    missingParameters: 'Thiếu tham số', waitingForScan: 'Đang chờ quét', scannedWaitingForConfirmation: 'Đã quét. Đang chờ xác nhận', qrCodeExpired: 'Mã QR đã hết hạn',
    downloadCodeSent: 'Đã gửi mã xác minh', downloadCodeInvalid: 'Mã xác minh không hợp lệ hoặc đã hết hạn', downloadRecordNotFound: 'Không tìm thấy lịch sử tải xuống', userCancelled: 'Người dùng này đã bị hủy', accountBanned: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ bộ phận hỗ trợ', userNotFound: 'Không tìm thấy người dùng', userStatusNotCancelled: 'Trạng thái tài khoản chưa bị hủy', signatureError: 'Lỗi chữ ký', accountCancellationWithdrawnFailed: 'Không thể rút lại yêu cầu hủy tài khoản', activeSubscriptionCancellationRequired: 'Bạn đang có gói đăng ký đang hoạt động. Vui lòng hủy gói trên nền tảng tương ứng trước khi hủy tài khoản',
  },
  fil: {
    operationSuccess: 'Matagumpay ang operasyon', operationFailed: 'Nabigo ang operasyon', tooManyRequests: 'Masyadong maraming pagsubok. Subukan ulit mamaya',
    requestFailed: 'Nabigo ang kahilingan', invalidParameters: 'Hindi wastong mga parameter', requiredField: 'Hindi maaaring walang laman ang mga kinakailangang field', dataExists: 'Mayroon na ang data', dataNotFound: 'Hindi nakita ang data',
    unauthorized: 'Nabigo ang awtorisasyon. Mangyaring mag-sign in', sessionExpired: 'Nag-expire na ang iyong session. Mag-sign in ulit', signedInElsewhere: 'Nag-sign in ang iyong account sa ibang device. Mag-sign in ulit', pageNotFound: 'Hindi nakita ang page', methodNotAllowed: 'Hindi pinapayagan ang HTTP method',
    serverError: 'Error sa server', systemMaintenance: 'Kasalukuyang minementena ang server at pansamantalang hindi available', cacheConfigError: 'Error sa configuration ng cache', cacheMiss: 'Hindi nakita sa cache', systemConfigError: 'Error sa configuration ng system', paymentConfigError: 'Hindi pa naka-configure ang serbisyo sa pagbabayad', serviceError: 'Error sa serbisyo', paymentOrderCreationFailed: 'Nabigong gumawa ng order sa pagbabayad',
    registrationFailed: 'Nabigo ang pagpaparehistro', loginFailed: 'Nabigo ang pag-login', invalidCredentials: 'Mali ang account o password', insufficientPoints: 'Hindi sapat ang puntos', insufficientBalance: 'Hindi sapat ang balanse', socialAccountBindingRequired: 'I-verify at i-link ang iyong social account',
    loginSuccess: 'Matagumpay na naka-login', logoutSuccess: 'Matagumpay na naka-logout', logoutFailed: 'Nabigo ang pag-logout', registrationSuccess: 'Matagumpay na nakapagparehistro', accountRegistered: 'Nakarehistro na ang account na ito', inviteCodeExists: 'Mayroon na ang invite code', inviteCodeNotFound: 'Hindi nakita ang invite code', invalidVerificationCode: 'Mali ang verification code', mobileNotFound: 'Hindi nakita ang numero ng mobile', inviteCodeAlreadySet: 'Nailagay na ang invite code', smsSent: 'Matagumpay na naipadala ang SMS', smsFailed: 'Nabigong ipadala ang SMS', emailSent: 'Matagumpay na naipadala ang email', emailFailed: 'Nabigong ipadala ang email',
    accountCancellationWithdrawn: 'Matagumpay na binawi ang pagkansela ng account', accountCancelled: 'Matagumpay na kinansela ang account', accountCancellationFailed: 'Nabigo ang pagkansela ng account',
    invalidCard: 'Hindi nakita ang activation code o na-activate na', cardNotFound: 'Hindi nakita ang activation code', cardDisabled: 'Na-disable ang activation code', cardExpired: 'Nag-expire na ang activation code', alreadyLifetimeMember: 'Mayroon ka nang lifetime membership at hindi maaaring mag-activate ng ibang card', alreadyLifetimeMemberNoPurchase: 'Lifetime member ka na. Hindi mo na kailangang bumili muli', productNotFound: 'Hindi nahanap ang produkto', productPriceInvalid: 'Hindi pa naka-configure ang presyo ng produkto', orderCurrencyInvalid: 'Hindi wastong pera ng order', orderAmountMismatch: 'Hindi tugma ang halagang binayaran sa halaga ng order', sanctionedCountry: 'Hindi available ang pagbili sa iyong rehiyon', orderCurrencyMismatch: 'Hindi tugma ang pera ng pagbabayad sa pera ng order',
    paymentSuccess: 'Matagumpay ang pagbabayad', paymentFailed: 'Nabigo ang pagbabayad', orderNotFound: 'Hindi nakita ang order', orderAlreadyPaid: 'Bayad na ang order', orderExpired: 'Nag-expire na ang order', orderCancelled: 'Kinansela ang order', orderStatusError: 'Hindi wasto ang status ng order', duplicateSubscription: 'Dobleng subscription order', orderRefundedOrRevoked: 'Na-refund o binawi ang order', orderRefunded: 'Matagumpay na na-refund ang order', orderRevoked: 'Binawi ang order',
    missingParameters: 'May kulang na parameter', waitingForScan: 'Naghihintay ng pag-scan', scannedWaitingForConfirmation: 'Na-scan na. Naghihintay ng kumpirmasyon', qrCodeExpired: 'Nag-expire na ang QR code',
    downloadCodeSent: 'Naipadala na ang verification code', downloadCodeInvalid: 'Hindi wasto o nag-expire na ang verification code', downloadRecordNotFound: 'Walang nakitang download record', userCancelled: 'Nakansela na ang user na ito', accountBanned: 'Na-ban ang iyong account. Mangyaring makipag-ugnayan sa suporta sa customer', userNotFound: 'Hindi nakita ang user', userStatusNotCancelled: 'Hindi pa kinansela ang status ng account', signatureError: 'Error sa lagda', accountCancellationWithdrawnFailed: 'Nabigo ang pag-withdraw ng pagkansela ng account', activeSubscriptionCancellationRequired: 'Mayroon kang aktibong subscription. Mangyaring kanselahin ito sa kaukulang platform bago kanselahin ang iyong account',
  },
  es: {
    operationSuccess: 'Operación completada correctamente', operationFailed: 'La operación ha fallado', tooManyRequests: 'Demasiados intentos. Inténtalo de nuevo más tarde',
    requestFailed: 'La solicitud ha fallado', invalidParameters: 'Parámetros no válidos', requiredField: 'Los campos obligatorios no pueden estar vacíos', dataExists: 'Los datos ya existen', dataNotFound: 'No se encontraron los datos',
    unauthorized: 'Error de autorización. Inicia sesión', sessionExpired: 'Tu sesión ha caducado. Inicia sesión de nuevo', signedInElsewhere: 'Tu cuenta ha iniciado sesión en otro dispositivo. Inicia sesión de nuevo', pageNotFound: 'Página no encontrada', methodNotAllowed: 'Método HTTP no permitido',
    serverError: 'Error del servidor', systemMaintenance: 'El servidor está en mantenimiento y no está disponible temporalmente', cacheConfigError: 'Error de configuración de caché', cacheMiss: 'No se encontró en caché', systemConfigError: 'Error de configuración del sistema', paymentConfigError: 'El servicio de pago no está configurado', serviceError: 'Error del servicio', paymentOrderCreationFailed: 'No se pudo crear el pedido de pago',
    registrationFailed: 'Error de registro', loginFailed: 'Error al iniciar sesión', invalidCredentials: 'Cuenta o contraseña incorrectas', insufficientPoints: 'Puntos insuficientes', insufficientBalance: 'Saldo insuficiente', socialAccountBindingRequired: 'Verifica y vincula tu cuenta social',
    loginSuccess: 'Sesión iniciada correctamente', logoutSuccess: 'Sesión cerrada correctamente', logoutFailed: 'Error al cerrar sesión', registrationSuccess: 'Registro completado correctamente', accountRegistered: 'Esta cuenta ya está registrada', inviteCodeExists: 'El código de invitación ya existe', inviteCodeNotFound: 'No se encontró el código de invitación', invalidVerificationCode: 'Código de verificación incorrecto', mobileNotFound: 'No se encontró el número de teléfono', inviteCodeAlreadySet: 'Ya se ha introducido un código de invitación', smsSent: 'SMS enviado correctamente', smsFailed: 'No se pudo enviar el SMS', emailSent: 'Correo enviado correctamente', emailFailed: 'No se pudo enviar el correo',
    accountCancellationWithdrawn: 'Cancelación de cuenta retirada correctamente', accountCancelled: 'Cuenta cancelada correctamente', accountCancellationFailed: 'No se pudo cancelar la cuenta',
    invalidCard: 'Código de activación no encontrado o ya activado', cardNotFound: 'No se encontró el código de activación', cardDisabled: 'El código de activación ha sido deshabilitado', cardExpired: 'El código de activación ha caducado', alreadyLifetimeMember: 'Ya tienes una membresía de por vida y no puedes activar otras tarjetas', alreadyLifetimeMemberNoPurchase: 'Ya eres miembro de por vida. No necesitas volver a comprar', productNotFound: 'Producto no encontrado', productPriceInvalid: 'El precio del producto no está configurado', orderCurrencyInvalid: 'Moneda de pedido no válida', orderAmountMismatch: 'El importe del pago no coincide con el importe del pedido', sanctionedCountry: 'Las compras no están disponibles en tu región', orderCurrencyMismatch: 'La moneda de pago no coincide con la moneda del pedido',
    paymentSuccess: 'Pago completado correctamente', paymentFailed: 'El pago ha fallado', orderNotFound: 'Pedido no encontrado', orderAlreadyPaid: 'El pedido ya está pagado', orderExpired: 'El pedido ha caducado', orderCancelled: 'Pedido cancelado', orderStatusError: 'Estado del pedido no válido', duplicateSubscription: 'Pedido de suscripción duplicado', orderRefundedOrRevoked: 'Pedido reembolsado o revocado', orderRefunded: 'Pedido reembolsado correctamente', orderRevoked: 'Pedido revocado',
    missingParameters: 'Faltan parámetros', waitingForScan: 'Esperando escaneo', scannedWaitingForConfirmation: 'Escaneado. Esperando confirmación', qrCodeExpired: 'El código QR ha caducado',
    downloadCodeSent: 'Código de verificación enviado', downloadCodeInvalid: 'El código de verificación no es válido o ha caducado', downloadRecordNotFound: 'No se encontró ningún registro de descarga', userCancelled: 'Este usuario ha sido cancelado', accountBanned: 'Tu cuenta ha sido bloqueada. Ponte en contacto con el servicio de atención al cliente', userNotFound: 'Usuario no encontrado', userStatusNotCancelled: 'El estado de la cuenta no es de cancelación', signatureError: 'Error de firma', accountCancellationWithdrawnFailed: 'No se pudo retirar la cancelación de la cuenta', activeSubscriptionCancellationRequired: 'Tienes una suscripción activa. Cancélala en la plataforma correspondiente antes de cancelar tu cuenta',
  },
  pt: {
    operationSuccess: 'Operação concluída com sucesso', operationFailed: 'A operação falhou', tooManyRequests: 'Demasiadas tentativas. Tente novamente mais tarde',
    requestFailed: 'O pedido falhou', invalidParameters: 'Parâmetros inválidos', requiredField: 'Os campos obrigatórios não podem ficar vazios', dataExists: 'Os dados já existem', dataNotFound: 'Dados não encontrados',
    unauthorized: 'Falha na autorização. Inicie sessão', sessionExpired: 'A sua sessão expirou. Inicie sessão novamente', signedInElsewhere: 'A sua conta iniciou sessão noutro dispositivo. Inicie sessão novamente', pageNotFound: 'Página não encontrada', methodNotAllowed: 'Método HTTP não permitido',
    serverError: 'Erro do servidor', systemMaintenance: 'O servidor está em manutenção e temporariamente indisponível', cacheConfigError: 'Erro de configuração da cache', cacheMiss: 'Cache não encontrada', systemConfigError: 'Erro de configuração do sistema', paymentConfigError: 'O serviço de pagamento não está configurado', serviceError: 'Erro do serviço', paymentOrderCreationFailed: 'Não foi possível criar a encomenda de pagamento',
    registrationFailed: 'Falha no registo', loginFailed: 'Falha ao iniciar sessão', invalidCredentials: 'Conta ou palavra-passe incorreta', insufficientPoints: 'Pontos insuficientes', insufficientBalance: 'Saldo insuficiente', socialAccountBindingRequired: 'Verifique e associe a sua conta social',
    loginSuccess: 'Sessão iniciada com sucesso', logoutSuccess: 'Sessão terminada com sucesso', logoutFailed: 'Falha ao terminar sessão', registrationSuccess: 'Registo concluído com sucesso', accountRegistered: 'Esta conta já está registada', inviteCodeExists: 'O código de convite já existe', inviteCodeNotFound: 'Código de convite não encontrado', invalidVerificationCode: 'Código de verificação incorreto', mobileNotFound: 'Número de telemóvel não encontrado', inviteCodeAlreadySet: 'Já foi introduzido um código de convite', smsSent: 'SMS enviado com sucesso', smsFailed: 'Falha ao enviar SMS', emailSent: 'E-mail enviado com sucesso', emailFailed: 'Falha ao enviar e-mail',
    accountCancellationWithdrawn: 'Cancelamento da conta retirado com sucesso', accountCancelled: 'Conta cancelada com sucesso', accountCancellationFailed: 'Falha ao cancelar a conta',
    invalidCard: 'Código de ativação não encontrado ou já ativado', cardNotFound: 'Código de ativação não encontrado', cardDisabled: 'O código de ativação foi desativado', cardExpired: 'O código de ativação expirou', alreadyLifetimeMember: 'Já tem uma subscrição vitalícia e não pode ativar outros cartões', alreadyLifetimeMemberNoPurchase: 'Você já é membro vitalício. Não precisa comprar novamente', productNotFound: 'Produto não encontrado', productPriceInvalid: 'O preço do produto não está configurado', orderCurrencyInvalid: 'Moeda do pedido inválida', orderAmountMismatch: 'O valor do pagamento não corresponde ao valor do pedido', sanctionedCountry: 'As compras não estão disponíveis na sua região', orderCurrencyMismatch: 'A moeda de pagamento não corresponde à moeda do pedido',
    paymentSuccess: 'Pagamento concluído com sucesso', paymentFailed: 'O pagamento falhou', orderNotFound: 'Encomenda não encontrada', orderAlreadyPaid: 'A encomenda já foi paga', orderExpired: 'A encomenda expirou', orderCancelled: 'Encomenda cancelada', orderStatusError: 'Estado da encomenda inválido', duplicateSubscription: 'Encomenda de subscrição duplicada', orderRefundedOrRevoked: 'Encomenda reembolsada ou revogada', orderRefunded: 'Encomenda reembolsada com sucesso', orderRevoked: 'Encomenda revogada',
    missingParameters: 'Parâmetros em falta', waitingForScan: 'A aguardar leitura', scannedWaitingForConfirmation: 'Lido. A aguardar confirmação', qrCodeExpired: 'O código QR expirou',
    downloadCodeSent: 'Código de verificação enviado', downloadCodeInvalid: 'O código de verificação é inválido ou expirou', downloadRecordNotFound: 'Nenhum registo de transferência encontrado', userCancelled: 'Este usuário foi cancelado', accountBanned: 'A sua conta foi bloqueada. Entre em contacto com o apoio ao cliente', userNotFound: 'Utilizador não encontrado', userStatusNotCancelled: 'O estado da conta não é de cancelamento', signatureError: 'Erro de assinatura', accountCancellationWithdrawnFailed: 'Não foi possível retirar o cancelamento da conta', activeSubscriptionCancellationRequired: 'Tem uma subscrição ativa. Cancele-a na plataforma correspondente antes de cancelar a sua conta',
  },
  ar: {
    operationSuccess: 'تمت العملية بنجاح', operationFailed: 'فشلت العملية', tooManyRequests: 'محاولات كثيرة جدًا. يرجى المحاولة لاحقًا',
    requestFailed: 'فشل الطلب', invalidParameters: 'معلمات غير صالحة', requiredField: 'لا يمكن ترك الحقول المطلوبة فارغة', dataExists: 'البيانات موجودة بالفعل', dataNotFound: 'لم يتم العثور على البيانات',
    unauthorized: 'فشل التفويض. يرجى تسجيل الدخول', sessionExpired: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى', signedInElsewhere: 'تم تسجيل الدخول إلى حسابك على جهاز آخر. يرجى تسجيل الدخول مرة أخرى', pageNotFound: 'الصفحة غير موجودة', methodNotAllowed: 'طريقة HTTP غير مسموح بها',
    serverError: 'خطأ في الخادم', systemMaintenance: 'الخادم قيد الصيانة وغير متاح مؤقتًا', cacheConfigError: 'خطأ في إعداد ذاكرة التخزين المؤقت', cacheMiss: 'لم يتم العثور على البيانات في ذاكرة التخزين المؤقت', systemConfigError: 'خطأ في إعداد النظام', paymentConfigError: 'خدمة الدفع غير مهيأة', serviceError: 'خطأ في الخدمة', paymentOrderCreationFailed: 'فشل إنشاء طلب الدفع',
    registrationFailed: 'فشل التسجيل', loginFailed: 'فشل تسجيل الدخول', invalidCredentials: 'الحساب أو كلمة المرور غير صحيحة', insufficientPoints: 'النقاط غير كافية', insufficientBalance: 'الرصيد غير كافٍ', socialAccountBindingRequired: 'يرجى التحقق من حسابك الاجتماعي وربطه',
    loginSuccess: 'تم تسجيل الدخول بنجاح', logoutSuccess: 'تم تسجيل الخروج بنجاح', logoutFailed: 'فشل تسجيل الخروج', registrationSuccess: 'تم التسجيل بنجاح', accountRegistered: 'هذا الحساب مسجل بالفعل', inviteCodeExists: 'رمز الدعوة موجود بالفعل', inviteCodeNotFound: 'رمز الدعوة غير موجود', invalidVerificationCode: 'رمز التحقق غير صحيح', mobileNotFound: 'رقم الهاتف غير موجود', inviteCodeAlreadySet: 'تم إدخال رمز دعوة بالفعل', smsSent: 'تم إرسال الرسالة النصية بنجاح', smsFailed: 'فشل إرسال الرسالة النصية', emailSent: 'تم إرسال البريد الإلكتروني بنجاح', emailFailed: 'فشل إرسال البريد الإلكتروني',
    accountCancellationWithdrawn: 'تم سحب طلب إلغاء الحساب بنجاح', accountCancelled: 'تم إلغاء الحساب بنجاح', accountCancellationFailed: 'فشل إلغاء الحساب',
    invalidCard: 'رمز التفعيل غير موجود أو تم تفعيله بالفعل', cardNotFound: 'رمز التفعيل غير موجود', cardDisabled: 'تم تعطيل رمز التفعيل', cardExpired: 'انتهت صلاحية رمز التفعيل', alreadyLifetimeMember: 'لديك بالفعل عضوية مدى الحياة ولا يمكنك تفعيل بطاقات أخرى', alreadyLifetimeMemberNoPurchase: 'أنت بالفعل عضو مدى الحياة. لا حاجة إلى الشراء مرة أخرى', productNotFound: 'المنتج غير موجود', productPriceInvalid: 'لم يتم تكوين سعر المنتج', orderCurrencyInvalid: 'عملة الطلب غير صالحة', orderAmountMismatch: 'مبلغ الدفع لا يطابق مبلغ الطلب', sanctionedCountry: 'الشراء غير متاح في منطقتك', orderCurrencyMismatch: 'عملة الدفع لا تطابق عملة الطلب',
    paymentSuccess: 'تم الدفع بنجاح', paymentFailed: 'فشل الدفع', orderNotFound: 'الطلب غير موجود', orderAlreadyPaid: 'تم دفع الطلب بالفعل', orderExpired: 'انتهت صلاحية الطلب', orderCancelled: 'تم إلغاء الطلب', orderStatusError: 'حالة الطلب غير صالحة', duplicateSubscription: 'طلب اشتراك مكرر', orderRefundedOrRevoked: 'تم رد قيمة الطلب أو إلغاؤه', orderRefunded: 'تم رد قيمة الطلب بنجاح', orderRevoked: 'تم إلغاء الطلب',
    missingParameters: 'معلمات مفقودة', waitingForScan: 'في انتظار المسح', scannedWaitingForConfirmation: 'تم المسح. في انتظار التأكيد', qrCodeExpired: 'انتهت صلاحية رمز QR',
    downloadCodeSent: 'تم إرسال رمز التحقق', downloadCodeInvalid: 'رمز التحقق غير صالح أو منتهي الصلاحية', downloadRecordNotFound: 'لم يتم العثور على سجل تنزيل', userCancelled: 'تم إلغاء هذا المستخدم', accountBanned: 'تم حظر حسابك. يرجى التواصل مع خدمة العملاء', userNotFound: 'المستخدم غير موجود', userStatusNotCancelled: 'حالة الحساب غير ملغاة', signatureError: 'خطأ في التوقيع', accountCancellationWithdrawnFailed: 'فشل سحب طلب إلغاء الحساب', activeSubscriptionCancellationRequired: 'لديك اشتراك نشط. يرجى إلغاء الاشتراك على المنصة المعنية قبل إلغاء حسابك',
  },
  ja: {
    operationSuccess: '操作が完了しました', operationFailed: '操作に失敗しました', tooManyRequests: '操作が頻繁すぎます。しばらくしてからもう一度お試しください',
    requestFailed: 'リクエストに失敗しました', invalidParameters: 'パラメーターが正しくありません', requiredField: '必須項目を入力してください', dataExists: 'データはすでに存在します', dataNotFound: 'データが見つかりません',
    unauthorized: '認証に失敗しました。ログインしてください', sessionExpired: 'セッションの有効期限が切れました。もう一度ログインしてください', signedInElsewhere: '別のデバイスでログインされました。もう一度ログインしてください', pageNotFound: 'ページが見つかりません', methodNotAllowed: '許可されていないHTTPメソッドです',
    serverError: 'サーバーエラー', systemMaintenance: 'サーバーはメンテナンス中のため、一時的に利用できません', cacheConfigError: 'キャッシュ設定エラー', cacheMiss: 'キャッシュが見つかりません', systemConfigError: 'システム設定エラー', paymentConfigError: '決済サービスが設定されていません', serviceError: 'サービスエラー', paymentOrderCreationFailed: '支払い注文の作成に失敗しました',
    registrationFailed: '登録に失敗しました', loginFailed: 'ログインに失敗しました', invalidCredentials: 'アカウントまたはパスワードが正しくありません', insufficientPoints: 'ポイントが不足しています', insufficientBalance: '残高が不足しています', socialAccountBindingRequired: 'ソーシャルアカウントを確認して連携してください',
    loginSuccess: 'ログインしました', logoutSuccess: 'ログアウトしました', logoutFailed: 'ログアウトに失敗しました', registrationSuccess: '登録が完了しました', accountRegistered: 'このアカウントは登録済みです', inviteCodeExists: '招待コードはすでに存在します', inviteCodeNotFound: '招待コードが見つかりません', invalidVerificationCode: '認証コードが正しくありません', mobileNotFound: '電話番号が見つかりません', inviteCodeAlreadySet: '招待コードはすでに入力されています', smsSent: 'SMSを送信しました', smsFailed: 'SMSの送信に失敗しました', emailSent: 'メールを送信しました', emailFailed: 'メールの送信に失敗しました',
    accountCancellationWithdrawn: 'アカウント削除を取り消しました', accountCancelled: 'アカウントを削除しました', accountCancellationFailed: 'アカウントの削除に失敗しました',
    invalidCard: 'アクティベーションコードが見つからないか、すでに有効化されています', cardNotFound: 'アクティベーションコードが見つかりません', cardDisabled: 'アクティベーションコードは無効化されています', cardExpired: 'アクティベーションコードの有効期限が切れています', alreadyLifetimeMember: 'すでに生涯会員のため、他のカードを有効化できません', alreadyLifetimeMemberNoPurchase: 'すでに終身会員です。追加で購入する必要はありません', productNotFound: '商品が見つかりません', productPriceInvalid: '商品の価格が設定されていません', orderCurrencyInvalid: '注文通貨が不正です', orderAmountMismatch: '支払金額が注文金額と一致しません', sanctionedCountry: 'この地域では購入サービスを利用できません', orderCurrencyMismatch: '支払通貨が注文通貨と一致しません',
    paymentSuccess: '支払いが完了しました', paymentFailed: '支払いに失敗しました', orderNotFound: '注文が見つかりません', orderAlreadyPaid: '注文は支払い済みです', orderExpired: '注文の有効期限が切れています', orderCancelled: '注文はキャンセルされました', orderStatusError: '注文ステータスが正しくありません', duplicateSubscription: '重複したサブスクリプション注文です', orderRefundedOrRevoked: '注文は返金または取り消されました', orderRefunded: '注文を返金しました', orderRevoked: '注文は取り消されました',
    missingParameters: 'パラメーターが不足しています', waitingForScan: 'スキャンを待っています', scannedWaitingForConfirmation: 'スキャン済みです。確認を待っています', qrCodeExpired: 'QRコードの有効期限が切れました',
    downloadCodeSent: '認証コードを送信しました', downloadCodeInvalid: '認証コードが無効または期限切れです', downloadRecordNotFound: 'ダウンロード履歴が見つかりません', userCancelled: 'このユーザーは削除済みです', accountBanned: 'アカウントが停止されました。カスタマーサポートにお問い合わせください', userNotFound: 'ユーザーが見つかりません', userStatusNotCancelled: 'アカウントは削除されていません', signatureError: '署名エラー', accountCancellationWithdrawnFailed: 'アカウント削除の取り消しに失敗しました', activeSubscriptionCancellationRequired: '有効なサブスクリプションがあります。アカウントを削除する前に、該当プラットフォームでサブスクリプションを解約してください',
  },
  tr: {
    operationSuccess: 'İşlem başarıyla tamamlandı', operationFailed: 'İşlem başarısız oldu', tooManyRequests: 'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin',
    requestFailed: 'İstek başarısız oldu', invalidParameters: 'Geçersiz parametreler', requiredField: 'Zorunlu alanlar boş bırakılamaz', dataExists: 'Veri zaten mevcut', dataNotFound: 'Veri bulunamadı',
    unauthorized: 'Yetkilendirme başarısız. Lütfen giriş yapın', sessionExpired: 'Oturumunuzun süresi doldu. Lütfen yeniden giriş yapın', signedInElsewhere: 'Hesabınız başka bir cihazda açıldı. Lütfen yeniden giriş yapın', pageNotFound: 'Sayfa bulunamadı', methodNotAllowed: 'HTTP yöntemine izin verilmiyor',
    serverError: 'Sunucu hatası', systemMaintenance: 'Sunucu bakımda ve geçici olarak kullanılamıyor', cacheConfigError: 'Önbellek yapılandırma hatası', cacheMiss: 'Önbellek bulunamadı', systemConfigError: 'Sistem yapılandırma hatası', paymentConfigError: 'Ödeme hizmeti yapılandırılmamış', serviceError: 'Hizmet hatası', paymentOrderCreationFailed: 'Ödeme siparişi oluşturulamadı',
    registrationFailed: 'Kayıt başarısız', loginFailed: 'Giriş başarısız', invalidCredentials: 'Hesap veya parola yanlış', insufficientPoints: 'Yetersiz puan', insufficientBalance: 'Yetersiz bakiye', socialAccountBindingRequired: 'Sosyal hesabınızı doğrulayıp bağlayın',
    loginSuccess: 'Başarıyla giriş yapıldı', logoutSuccess: 'Başarıyla çıkış yapıldı', logoutFailed: 'Çıkış başarısız', registrationSuccess: 'Kayıt başarıyla tamamlandı', accountRegistered: 'Bu hesap zaten kayıtlı', inviteCodeExists: 'Davet kodu zaten mevcut', inviteCodeNotFound: 'Davet kodu bulunamadı', invalidVerificationCode: 'Doğrulama kodu yanlış', mobileNotFound: 'Telefon numarası bulunamadı', inviteCodeAlreadySet: 'Davet kodu zaten girilmiş', smsSent: 'SMS başarıyla gönderildi', smsFailed: 'SMS gönderilemedi', emailSent: 'E-posta başarıyla gönderildi', emailFailed: 'E-posta gönderilemedi',
    accountCancellationWithdrawn: 'Hesap iptali başarıyla geri çekildi', accountCancelled: 'Hesap başarıyla iptal edildi', accountCancellationFailed: 'Hesap iptal edilemedi',
    invalidCard: 'Etkinleştirme kodu bulunamadı veya zaten etkinleştirilmiş', cardNotFound: 'Etkinleştirme kodu bulunamadı', cardDisabled: 'Etkinleştirme kodu devre dışı bırakılmış', cardExpired: 'Etkinleştirme kodunun süresi dolmuş', alreadyLifetimeMember: 'Zaten ömür boyu üyeliğiniz var, başka kart aktifleştiremezsiniz', alreadyLifetimeMemberNoPurchase: 'Zaten ömür boyu üyesisiniz. Tekrar satın almanıza gerek yok', productNotFound: 'Ürün bulunamadı', productPriceInvalid: 'Ürün fiyatı yapılandırılmamış', orderCurrencyInvalid: 'Sipariş para birimi geçersiz', orderAmountMismatch: 'Ödeme tutarı sipariş tutarıyla eşleşmiyor', sanctionedCountry: 'Bu bölgede satın alma desteklenmiyor', orderCurrencyMismatch: 'Ödeme para birimi sipariş para birimiyle eşleşmiyor',
    paymentSuccess: 'Ödeme başarıyla tamamlandı', paymentFailed: 'Ödeme başarısız', orderNotFound: 'Sipariş bulunamadı', orderAlreadyPaid: 'Sipariş zaten ödenmiş', orderExpired: 'Siparişin süresi dolmuş', orderCancelled: 'Sipariş iptal edildi', orderStatusError: 'Geçersiz sipariş durumu', duplicateSubscription: 'Yinelenen abonelik siparişi', orderRefundedOrRevoked: 'Sipariş iade edildi veya geri çekildi', orderRefunded: 'Sipariş başarıyla iade edildi', orderRevoked: 'Sipariş geri çekildi',
    missingParameters: 'Eksik parametreler', waitingForScan: 'Tarama bekleniyor', scannedWaitingForConfirmation: 'Tarandı. Onay bekleniyor', qrCodeExpired: 'QR kodunun süresi doldu',
    downloadCodeSent: 'Doğrulama kodu gönderildi', downloadCodeInvalid: 'Doğrulama kodu geçersiz veya süresi dolmuş', downloadRecordNotFound: 'İndirme kaydı bulunamadı', userCancelled: 'Bu kullanıcı iptal edilmiş', accountBanned: 'Hesabınız engellendi. Lütfen müşteri hizmetleriyle iletişime geçin', userNotFound: 'Kullanıcı bulunamadı', userStatusNotCancelled: 'Hesap durumu iptal edilmiş değil', signatureError: 'İmza hatası', accountCancellationWithdrawnFailed: 'Hesap iptali geri çekilemedi', activeSubscriptionCancellationRequired: 'Aktif bir aboneliğiniz var. Hesabınızı iptal etmeden önce ilgili platformda aboneliği iptal edin',
  },
  it: {
    operationSuccess: 'Operazione completata', operationFailed: 'Operazione non riuscita', tooManyRequests: 'Troppi tentativi. Riprova più tardi',
    requestFailed: 'Richiesta non riuscita', invalidParameters: 'Parametri non validi', requiredField: 'I campi obbligatori non possono essere vuoti', dataExists: 'I dati esistono già', dataNotFound: 'Dati non trovati',
    unauthorized: 'Autorizzazione non riuscita. Accedi', sessionExpired: 'La sessione è scaduta. Accedi di nuovo', signedInElsewhere: 'Il tuo account ha effettuato l’accesso su un altro dispositivo. Accedi di nuovo', pageNotFound: 'Pagina non trovata', methodNotAllowed: 'Metodo HTTP non consentito',
    serverError: 'Errore del server', systemMaintenance: 'Il server è in manutenzione e temporaneamente non disponibile', cacheConfigError: 'Errore di configurazione della cache', cacheMiss: 'Cache non trovata', systemConfigError: 'Errore di configurazione del sistema', paymentConfigError: 'Il servizio di pagamento non è configurato', serviceError: 'Errore del servizio', paymentOrderCreationFailed: 'Impossibile creare l\'ordine di pagamento',
    registrationFailed: 'Registrazione non riuscita', loginFailed: 'Accesso non riuscito', invalidCredentials: 'Account o password errati', insufficientPoints: 'Punti insufficienti', insufficientBalance: 'Saldo insufficiente', socialAccountBindingRequired: 'Verifica e collega il tuo account social',
    loginSuccess: 'Accesso effettuato', logoutSuccess: 'Disconnessione effettuata', logoutFailed: 'Disconnessione non riuscita', registrationSuccess: 'Registrazione completata', accountRegistered: 'Questo account è già registrato', inviteCodeExists: 'Il codice di invito esiste già', inviteCodeNotFound: 'Codice di invito non trovato', invalidVerificationCode: 'Codice di verifica errato', mobileNotFound: 'Numero di telefono non trovato', inviteCodeAlreadySet: 'È già stato inserito un codice di invito', smsSent: 'SMS inviato', smsFailed: 'Invio dell’SMS non riuscito', emailSent: 'Email inviata', emailFailed: 'Invio dell’email non riuscito',
    accountCancellationWithdrawn: 'Cancellazione dell’account revocata', accountCancelled: 'Account cancellato', accountCancellationFailed: 'Cancellazione dell’account non riuscita',
    invalidCard: 'Codice di attivazione non trovato o già attivato', cardNotFound: 'Codice di attivazione non trovato', cardDisabled: 'Il codice di attivazione è stato disabilitato', cardExpired: 'Il codice di attivazione è scaduto', alreadyLifetimeMember: 'Hai già un abbonamento a vita e non puoi attivare altre card', alreadyLifetimeMemberNoPurchase: 'Sei già un membro a vita. Non è necessario acquistare di nuovo', productNotFound: 'Prodotto non trovato', productPriceInvalid: 'Il prezzo del prodotto non è configurato', orderCurrencyInvalid: 'Valuta dell’ordine non valida', orderAmountMismatch: 'L’importo del pagamento non corrisponde all’importo dell’ordine', sanctionedCountry: 'Gli acquisti non sono disponibili nella tua regione', orderCurrencyMismatch: 'La valuta di pagamento non corrisponde alla valuta dell’ordine',
    paymentSuccess: 'Pagamento completato', paymentFailed: 'Pagamento non riuscito', orderNotFound: 'Ordine non trovato', orderAlreadyPaid: 'Ordine già pagato', orderExpired: 'Ordine scaduto', orderCancelled: 'Ordine annullato', orderStatusError: 'Stato dell’ordine non valido', duplicateSubscription: 'Ordine di abbonamento duplicato', orderRefundedOrRevoked: 'Ordine rimborsato o revocato', orderRefunded: 'Ordine rimborsato', orderRevoked: 'Ordine revocato',
    missingParameters: 'Parametri mancanti', waitingForScan: 'In attesa della scansione', scannedWaitingForConfirmation: 'Scansione completata. In attesa di conferma', qrCodeExpired: 'Codice QR scaduto',
    downloadCodeSent: 'Codice di verifica inviato', downloadCodeInvalid: 'Il codice di verifica non è valido o è scaduto', downloadRecordNotFound: 'Nessun record di download trovato', userCancelled: 'Questo utente è stato cancellato', accountBanned: 'Il tuo account è stato sospeso. Contatta l’assistenza clienti', userNotFound: 'Utente non trovato', userStatusNotCancelled: 'Lo stato dell’account non è di cancellazione', signatureError: 'Errore di firma', accountCancellationWithdrawnFailed: 'Impossibile revocare la cancellazione dell’account', activeSubscriptionCancellationRequired: 'Hai un abbonamento attivo. Annulla l’abbonamento sulla piattaforma corrispondente prima di cancellare l’account',
  },
  de: {
    operationSuccess: 'Vorgang erfolgreich abgeschlossen', operationFailed: 'Vorgang fehlgeschlagen', tooManyRequests: 'Zu viele Versuche. Bitte später erneut versuchen',
    requestFailed: 'Anfrage fehlgeschlagen', invalidParameters: 'Ungültige Parameter', requiredField: 'Pflichtfelder dürfen nicht leer sein', dataExists: 'Daten sind bereits vorhanden', dataNotFound: 'Daten nicht gefunden',
    unauthorized: 'Autorisierung fehlgeschlagen. Bitte anmelden', sessionExpired: 'Ihre Sitzung ist abgelaufen. Bitte erneut anmelden', signedInElsewhere: 'Ihr Konto wurde auf einem anderen Gerät angemeldet. Bitte erneut anmelden', pageNotFound: 'Seite nicht gefunden', methodNotAllowed: 'HTTP-Methode nicht zulässig',
    serverError: 'Serverfehler', systemMaintenance: 'Der Server wird gewartet und ist vorübergehend nicht verfügbar', cacheConfigError: 'Fehler bei der Cache-Konfiguration', cacheMiss: 'Cache-Eintrag nicht gefunden', systemConfigError: 'Fehler bei der Systemkonfiguration', paymentConfigError: 'Zahlungsdienst ist nicht konfiguriert', serviceError: 'Dienstfehler', paymentOrderCreationFailed: 'Zahlungsauftrag konnte nicht erstellt werden',
    registrationFailed: 'Registrierung fehlgeschlagen', loginFailed: 'Anmeldung fehlgeschlagen', invalidCredentials: 'Konto oder Passwort falsch', insufficientPoints: 'Nicht genügend Punkte', insufficientBalance: 'Unzureichendes Guthaben', socialAccountBindingRequired: 'Bitte Social-Media-Konto bestätigen und verknüpfen',
    loginSuccess: 'Erfolgreich angemeldet', logoutSuccess: 'Erfolgreich abgemeldet', logoutFailed: 'Abmeldung fehlgeschlagen', registrationSuccess: 'Erfolgreich registriert', accountRegistered: 'Dieses Konto ist bereits registriert', inviteCodeExists: 'Einladungscode ist bereits vorhanden', inviteCodeNotFound: 'Einladungscode nicht gefunden', invalidVerificationCode: 'Bestätigungscode ist falsch', mobileNotFound: 'Telefonnummer nicht gefunden', inviteCodeAlreadySet: 'Ein Einladungscode wurde bereits eingegeben', smsSent: 'SMS erfolgreich gesendet', smsFailed: 'SMS konnte nicht gesendet werden', emailSent: 'E-Mail erfolgreich gesendet', emailFailed: 'E-Mail konnte nicht gesendet werden',
    accountCancellationWithdrawn: 'Kontolöschung erfolgreich zurückgezogen', accountCancelled: 'Konto erfolgreich gelöscht', accountCancellationFailed: 'Kontolöschung fehlgeschlagen',
    invalidCard: 'Aktivierungscode nicht gefunden oder bereits aktiviert', cardNotFound: 'Aktivierungscode nicht gefunden', cardDisabled: 'Aktivierungscode wurde deaktiviert', cardExpired: 'Aktivierungscode ist abgelaufen', alreadyLifetimeMember: 'Du hast bereits eine lebenslange Mitgliedschaft und kannst keine anderen Karten aktivieren', alreadyLifetimeMemberNoPurchase: 'Sie sind bereits lebenslanges Mitglied. Ein weiterer Kauf ist nicht erforderlich', productNotFound: 'Produkt nicht gefunden', productPriceInvalid: 'Der Produktpreis ist nicht konfiguriert', orderCurrencyInvalid: 'Ungültige Bestellungswährung', orderAmountMismatch: 'Der Zahlungsbetrag stimmt nicht mit dem Bestellbetrag überein', sanctionedCountry: 'Käufe sind in Ihrer Region nicht verfügbar', orderCurrencyMismatch: 'Die Zahlungswährung stimmt nicht mit der Bestellungswährung überein',
    paymentSuccess: 'Zahlung erfolgreich abgeschlossen', paymentFailed: 'Zahlung fehlgeschlagen', orderNotFound: 'Bestellung nicht gefunden', orderAlreadyPaid: 'Bestellung wurde bereits bezahlt', orderExpired: 'Bestellung ist abgelaufen', orderCancelled: 'Bestellung wurde storniert', orderStatusError: 'Ungültiger Bestellstatus', duplicateSubscription: 'Doppelte Abonnementbestellung', orderRefundedOrRevoked: 'Bestellung wurde erstattet oder widerrufen', orderRefunded: 'Bestellung erfolgreich erstattet', orderRevoked: 'Bestellung widerrufen',
    missingParameters: 'Fehlende Parameter', waitingForScan: 'Warten auf Scan', scannedWaitingForConfirmation: 'Gescannt. Warten auf Bestätigung', qrCodeExpired: 'QR-Code ist abgelaufen',
    downloadCodeSent: 'Bestätigungscode gesendet', downloadCodeInvalid: 'Bestätigungscode ist ungültig oder abgelaufen', downloadRecordNotFound: 'Kein Download-Datensatz gefunden', userCancelled: 'Dieser Benutzer wurde gelöscht', accountBanned: 'Dein Konto wurde gesperrt. Bitte kontaktiere den Kundensupport', userNotFound: 'Benutzer nicht gefunden', userStatusNotCancelled: 'Der Kontostatus ist nicht gelöscht', signatureError: 'Signaturfehler', accountCancellationWithdrawnFailed: 'Die Kontolöschung konnte nicht zurückgezogen werden', activeSubscriptionCancellationRequired: 'Du hast ein aktives Abonnement. Bitte kündige es auf der entsprechenden Plattform, bevor du dein Konto löschst',
  },
  fr: {
    operationSuccess: 'Opération effectuée', operationFailed: 'Échec de l’opération', tooManyRequests: 'Trop de tentatives. Réessayez plus tard',
    requestFailed: 'Échec de la requête', invalidParameters: 'Paramètres non valides', requiredField: 'Les champs obligatoires ne peuvent pas être vides', dataExists: 'Les données existent déjà', dataNotFound: 'Données introuvables',
    unauthorized: 'Échec de l’autorisation. Connectez-vous', sessionExpired: 'Votre session a expiré. Reconnectez-vous', signedInElsewhere: 'Votre compte a été connecté sur un autre appareil. Reconnectez-vous', pageNotFound: 'Page introuvable', methodNotAllowed: 'Méthode HTTP non autorisée',
    serverError: 'Erreur du serveur', systemMaintenance: 'Le serveur est en maintenance et temporairement indisponible', cacheConfigError: 'Erreur de configuration du cache', cacheMiss: 'Élément absent du cache', systemConfigError: 'Erreur de configuration du système', paymentConfigError: 'Le service de paiement n’est pas configuré', serviceError: 'Erreur de service', paymentOrderCreationFailed: 'Échec de la création de la commande de paiement',
    registrationFailed: 'Échec de l’inscription', loginFailed: 'Échec de la connexion', invalidCredentials: 'Compte ou mot de passe incorrect', insufficientPoints: 'Points insuffisants', insufficientBalance: 'Solde insuffisant', socialAccountBindingRequired: 'Vérifiez et associez votre compte social',
    loginSuccess: 'Connexion réussie', logoutSuccess: 'Déconnexion réussie', logoutFailed: 'Échec de la déconnexion', registrationSuccess: 'Inscription réussie', accountRegistered: 'Ce compte est déjà inscrit', inviteCodeExists: 'Le code d’invitation existe déjà', inviteCodeNotFound: 'Code d’invitation introuvable', invalidVerificationCode: 'Code de vérification incorrect', mobileNotFound: 'Numéro de téléphone introuvable', inviteCodeAlreadySet: 'Un code d’invitation a déjà été saisi', smsSent: 'SMS envoyé', smsFailed: 'Échec de l’envoi du SMS', emailSent: 'E-mail envoyé', emailFailed: 'Échec de l’envoi de l’e-mail',
    accountCancellationWithdrawn: 'Suppression du compte annulée', accountCancelled: 'Compte supprimé', accountCancellationFailed: 'Échec de la suppression du compte',
    invalidCard: 'Code d’activation introuvable ou déjà activé', cardNotFound: 'Code d’activation introuvable', cardDisabled: 'Le code d’activation a été désactivé', cardExpired: 'Le code d’activation a expiré', alreadyLifetimeMember: 'Vous avez déjà un abonnement à vie et ne pouvez pas activer d’autres cartes', alreadyLifetimeMemberNoPurchase: 'Vous êtes déjà membre à vie. Aucun achat supplémentaire n’est nécessaire', productNotFound: 'Produit introuvable', productPriceInvalid: 'Le prix du produit n’est pas configuré', orderCurrencyInvalid: 'Devise de commande invalide', orderAmountMismatch: 'Le montant du paiement ne correspond pas au montant de la commande', sanctionedCountry: 'Les achats ne sont pas disponibles dans votre région', orderCurrencyMismatch: 'La devise de paiement ne correspond pas à la devise de la commande',
    paymentSuccess: 'Paiement effectué', paymentFailed: 'Échec du paiement', orderNotFound: 'Commande introuvable', orderAlreadyPaid: 'Commande déjà payée', orderExpired: 'Commande expirée', orderCancelled: 'Commande annulée', orderStatusError: 'Statut de commande non valide', duplicateSubscription: 'Commande d’abonnement en double', orderRefundedOrRevoked: 'Commande remboursée ou révoquée', orderRefunded: 'Commande remboursée', orderRevoked: 'Commande révoquée',
    missingParameters: 'Paramètres manquants', waitingForScan: 'En attente du scan', scannedWaitingForConfirmation: 'Scanné. En attente de confirmation', qrCodeExpired: 'Le code QR a expiré',
    downloadCodeSent: 'Code de vérification envoyé', downloadCodeInvalid: 'Le code de vérification est invalide ou a expiré', downloadRecordNotFound: 'Aucun historique de téléchargement trouvé', userCancelled: 'Cet utilisateur a été supprimé', accountBanned: 'Votre compte a été bloqué. Veuillez contacter le service client', userNotFound: 'Utilisateur introuvable', userStatusNotCancelled: 'Le compte n’est pas dans un état supprimé', signatureError: 'Erreur de signature', accountCancellationWithdrawnFailed: 'Échec de l’annulation de la suppression du compte', activeSubscriptionCancellationRequired: 'Vous avez un abonnement actif. Veuillez l’annuler sur la plateforme concernée avant de supprimer votre compte',
  },
  ko: {
    operationSuccess: '작업이 완료되었습니다', operationFailed: '작업에 실패했습니다', tooManyRequests: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요',
    requestFailed: '요청에 실패했습니다', invalidParameters: '매개변수가 올바르지 않습니다', requiredField: '필수 항목을 입력해 주세요', dataExists: '데이터가 이미 존재합니다', dataNotFound: '데이터를 찾을 수 없습니다',
    unauthorized: '인증에 실패했습니다. 로그인해 주세요', sessionExpired: '세션이 만료되었습니다. 다시 로그인해 주세요', signedInElsewhere: '다른 기기에서 로그인되었습니다. 다시 로그인해 주세요', pageNotFound: '페이지를 찾을 수 없습니다', methodNotAllowed: '허용되지 않는 HTTP 메서드입니다',
    serverError: '서버 오류', systemMaintenance: '서버 점검 중으로 일시적으로 사용할 수 없습니다', cacheConfigError: '캐시 설정 오류', cacheMiss: '캐시를 찾을 수 없습니다', systemConfigError: '시스템 설정 오류', paymentConfigError: '결제 서비스가 설정되지 않았습니다', serviceError: '서비스 오류', paymentOrderCreationFailed: '결제 주문 생성에 실패했습니다',
    registrationFailed: '회원가입에 실패했습니다', loginFailed: '로그인에 실패했습니다', invalidCredentials: '계정 또는 비밀번호가 올바르지 않습니다', insufficientPoints: '포인트가 부족합니다', insufficientBalance: '잔액이 부족합니다', socialAccountBindingRequired: '소셜 계정을 인증하고 연결해 주세요',
    loginSuccess: '로그인했습니다', logoutSuccess: '로그아웃했습니다', logoutFailed: '로그아웃에 실패했습니다', registrationSuccess: '회원가입이 완료되었습니다', accountRegistered: '이미 등록된 계정입니다', inviteCodeExists: '초대 코드가 이미 존재합니다', inviteCodeNotFound: '초대 코드를 찾을 수 없습니다', invalidVerificationCode: '인증 코드가 올바르지 않습니다', mobileNotFound: '휴대전화 번호를 찾을 수 없습니다', inviteCodeAlreadySet: '초대 코드가 이미 입력되었습니다', smsSent: 'SMS를 전송했습니다', smsFailed: 'SMS 전송에 실패했습니다', emailSent: '이메일을 전송했습니다', emailFailed: '이메일 전송에 실패했습니다',
    accountCancellationWithdrawn: '계정 해지 신청을 철회했습니다', accountCancelled: '계정이 해지되었습니다', accountCancellationFailed: '계정 해지에 실패했습니다',
    invalidCard: '활성화 코드를 찾을 수 없거나 이미 활성화되었습니다', cardNotFound: '활성화 코드를 찾을 수 없습니다', cardDisabled: '활성화 코드가 비활성화되었습니다', cardExpired: '활성화 코드가 만료되었습니다', alreadyLifetimeMember: '이미 평생 회원이므로 다른 카드를 활성화할 수 없습니다', alreadyLifetimeMemberNoPurchase: '이미 평생 회원입니다. 추가 구매가 필요하지 않습니다', productNotFound: '상품을 찾을 수 없습니다', productPriceInvalid: '상품 가격이 구성되어 있지 않습니다', orderCurrencyInvalid: '주문 통화가 잘못되었습니다', orderAmountMismatch: '결제 금액이 주문 금액과 일치하지 않습니다', sanctionedCountry: '이 지역에서는 구매 서비스를 지원하지 않습니다', orderCurrencyMismatch: '결제 통화가 주문 통화와 일치하지 않습니다',
    paymentSuccess: '결제가 완료되었습니다', paymentFailed: '결제에 실패했습니다', orderNotFound: '주문을 찾을 수 없습니다', orderAlreadyPaid: '이미 결제된 주문입니다', orderExpired: '주문이 만료되었습니다', orderCancelled: '주문이 취소되었습니다', orderStatusError: '주문 상태가 올바르지 않습니다', duplicateSubscription: '중복 구독 주문입니다', orderRefundedOrRevoked: '주문이 환불 또는 철회되었습니다', orderRefunded: '주문이 환불되었습니다', orderRevoked: '주문이 철회되었습니다',
    missingParameters: '매개변수가 누락되었습니다', waitingForScan: '스캔 대기 중', scannedWaitingForConfirmation: '스캔했습니다. 확인 대기 중', qrCodeExpired: 'QR 코드가 만료되었습니다',
    downloadCodeSent: '인증 코드를 전송했습니다', downloadCodeInvalid: '인증 코드가 유효하지 않거나 만료되었습니다', downloadRecordNotFound: '다운로드 기록을 찾을 수 없습니다', userCancelled: '이 사용자는 탈퇴되었습니다', accountBanned: '계정이 차단되었습니다. 고객센터에 문의해 주세요', userNotFound: '사용자를 찾을 수 없습니다', userStatusNotCancelled: '계정 상태가 탈퇴 상태가 아닙니다', signatureError: '서명 오류', accountCancellationWithdrawnFailed: '계정 탈퇴 신청을 철회하지 못했습니다', activeSubscriptionCancellationRequired: '활성 구독이 있습니다. 계정을 탈퇴하기 전에 해당 플랫폼에서 구독을 취소해 주세요',
  },
  ru: {
    operationSuccess: 'Операция выполнена', operationFailed: 'Не удалось выполнить операцию', tooManyRequests: 'Слишком много попыток. Повторите позже',
    requestFailed: 'Не удалось выполнить запрос', invalidParameters: 'Недопустимые параметры', requiredField: 'Обязательные поля не могут быть пустыми', dataExists: 'Данные уже существуют', dataNotFound: 'Данные не найдены',
    unauthorized: 'Ошибка авторизации. Войдите в систему', sessionExpired: 'Сеанс истёк. Войдите снова', signedInElsewhere: 'В ваш аккаунт вошли на другом устройстве. Войдите снова', pageNotFound: 'Страница не найдена', methodNotAllowed: 'Метод HTTP не разрешён',
    serverError: 'Ошибка сервера', systemMaintenance: 'Сервер находится на обслуживании и временно недоступен', cacheConfigError: 'Ошибка конфигурации кеша', cacheMiss: 'Данные не найдены в кеше', systemConfigError: 'Ошибка конфигурации системы', paymentConfigError: 'Платёжный сервис не настроен', serviceError: 'Ошибка сервиса', paymentOrderCreationFailed: 'Не удалось создать платёжный заказ',
    registrationFailed: 'Ошибка регистрации', loginFailed: 'Ошибка входа', invalidCredentials: 'Неверный аккаунт или пароль', insufficientPoints: 'Недостаточно баллов', insufficientBalance: 'Недостаточно средств', socialAccountBindingRequired: 'Подтвердите и привяжите социальный аккаунт',
    loginSuccess: 'Вход выполнен', logoutSuccess: 'Выход выполнен', logoutFailed: 'Ошибка выхода', registrationSuccess: 'Регистрация завершена', accountRegistered: 'Этот аккаунт уже зарегистрирован', inviteCodeExists: 'Код приглашения уже существует', inviteCodeNotFound: 'Код приглашения не найден', invalidVerificationCode: 'Неверный код подтверждения', mobileNotFound: 'Номер телефона не найден', inviteCodeAlreadySet: 'Код приглашения уже введён', smsSent: 'SMS отправлено', smsFailed: 'Не удалось отправить SMS', emailSent: 'Письмо отправлено', emailFailed: 'Не удалось отправить письмо',
    accountCancellationWithdrawn: 'Удаление аккаунта отменено', accountCancelled: 'Аккаунт удалён', accountCancellationFailed: 'Не удалось удалить аккаунт',
    invalidCard: 'Код активации не найден или уже активирован', cardNotFound: 'Код активации не найден', cardDisabled: 'Код активации отключён', cardExpired: 'Срок действия кода активации истёк', alreadyLifetimeMember: 'У вас уже есть пожизненное членство, активация других карт невозможна', alreadyLifetimeMemberNoPurchase: 'Вы уже являетесь пожизненным участником. Повторная покупка не требуется', productNotFound: 'Товар не найден', productPriceInvalid: 'Цена товара не настроена', orderCurrencyInvalid: 'Неверная валюта заказа', orderAmountMismatch: 'Сумма платежа не совпадает с суммой заказа', sanctionedCountry: 'Покупки недоступны в вашем регионе', orderCurrencyMismatch: 'Валюта платежа не совпадает с валютой заказа',
    paymentSuccess: 'Оплата выполнена', paymentFailed: 'Ошибка оплаты', orderNotFound: 'Заказ не найден', orderAlreadyPaid: 'Заказ уже оплачен', orderExpired: 'Срок действия заказа истёк', orderCancelled: 'Заказ отменён', orderStatusError: 'Недопустимый статус заказа', duplicateSubscription: 'Повторный заказ подписки', orderRefundedOrRevoked: 'Заказ возвращён или отозван', orderRefunded: 'Средства за заказ возвращены', orderRevoked: 'Заказ отозван',
    missingParameters: 'Отсутствуют параметры', waitingForScan: 'Ожидание сканирования', scannedWaitingForConfirmation: 'Отсканировано. Ожидание подтверждения', qrCodeExpired: 'Срок действия QR-кода истёк',
    downloadCodeSent: 'Код подтверждения отправлен', downloadCodeInvalid: 'Код подтверждения недействителен или истёк', downloadRecordNotFound: 'Запись о загрузке не найдена', userCancelled: 'Этот пользователь удалён', accountBanned: 'Ваш аккаунт заблокирован. Свяжитесь со службой поддержки', userNotFound: 'Пользователь не найден', userStatusNotCancelled: 'Аккаунт не находится в статусе удаления', signatureError: 'Ошибка подписи', accountCancellationWithdrawnFailed: 'Не удалось отменить удаление аккаунта', activeSubscriptionCancellationRequired: 'У вас есть активная подписка. Отмените её на соответствующей платформе, прежде чем удалять аккаунт',
  },
  pl: {
    operationSuccess: 'Operacja zakończona pomyślnie', operationFailed: 'Operacja nie powiodła się', tooManyRequests: 'Zbyt wiele prób. Spróbuj ponownie później',
    requestFailed: 'Żądanie nie powiodło się', invalidParameters: 'Nieprawidłowe parametry', requiredField: 'Pola wymagane nie mogą być puste', dataExists: 'Dane już istnieją', dataNotFound: 'Nie znaleziono danych',
    unauthorized: 'Autoryzacja nie powiodła się. Zaloguj się', sessionExpired: 'Sesja wygasła. Zaloguj się ponownie', signedInElsewhere: 'Na Twoje konto zalogowano się na innym urządzeniu. Zaloguj się ponownie', pageNotFound: 'Nie znaleziono strony', methodNotAllowed: 'Niedozwolona metoda HTTP',
    serverError: 'Błąd serwera', systemMaintenance: 'Serwer jest w trakcie konserwacji i jest tymczasowo niedostępny', cacheConfigError: 'Błąd konfiguracji pamięci podręcznej', cacheMiss: 'Brak danych w pamięci podręcznej', systemConfigError: 'Błąd konfiguracji systemu', paymentConfigError: 'Usługa płatności nie jest skonfigurowana', serviceError: 'Błąd usługi', paymentOrderCreationFailed: 'Nie udało się utworzyć zamówienia płatności',
    registrationFailed: 'Rejestracja nie powiodła się', loginFailed: 'Logowanie nie powiodło się', invalidCredentials: 'Nieprawidłowe konto lub hasło', insufficientPoints: 'Niewystarczająca liczba punktów', insufficientBalance: 'Niewystarczające saldo', socialAccountBindingRequired: 'Zweryfikuj i połącz konto społecznościowe',
    loginSuccess: 'Zalogowano pomyślnie', logoutSuccess: 'Wylogowano pomyślnie', logoutFailed: 'Wylogowanie nie powiodło się', registrationSuccess: 'Zarejestrowano pomyślnie', accountRegistered: 'To konto jest już zarejestrowane', inviteCodeExists: 'Kod zaproszenia już istnieje', inviteCodeNotFound: 'Nie znaleziono kodu zaproszenia', invalidVerificationCode: 'Nieprawidłowy kod weryfikacyjny', mobileNotFound: 'Nie znaleziono numeru telefonu', inviteCodeAlreadySet: 'Kod zaproszenia został już wprowadzony', smsSent: 'Wysłano SMS', smsFailed: 'Nie udało się wysłać SMS-a', emailSent: 'Wysłano wiadomość e-mail', emailFailed: 'Nie udało się wysłać wiadomości e-mail',
    accountCancellationWithdrawn: 'Wycofano usunięcie konta', accountCancelled: 'Konto zostało usunięte', accountCancellationFailed: 'Nie udało się usunąć konta',
    invalidCard: 'Nie znaleziono kodu aktywacyjnego lub został już aktywowany', cardNotFound: 'Nie znaleziono kodu aktywacyjnego', cardDisabled: 'Kod aktywacyjny został wyłączony', cardExpired: 'Kod aktywacyjny wygasł', alreadyLifetimeMember: 'Masz już dożywotnie członkostwo i nie możesz aktywować innych kart', alreadyLifetimeMemberNoPurchase: 'Jesteś już członkiem dożywotnim. Nie musisz kupować ponownie', productNotFound: 'Nie znaleziono produktu', productPriceInvalid: 'Cena produktu nie jest skonfigurowana', orderCurrencyInvalid: 'Nieprawidłowa waluta zamówienia', orderAmountMismatch: 'Kwota płatności nie odpowiada kwocie zamówienia', sanctionedCountry: 'Zakupy nie są dostępne w Twoim regionie', orderCurrencyMismatch: 'Waluta płatności nie odpowiada walucie zamówienia',
    paymentSuccess: 'Płatność zakończona pomyślnie', paymentFailed: 'Płatność nie powiodła się', orderNotFound: 'Nie znaleziono zamówienia', orderAlreadyPaid: 'Zamówienie zostało już opłacone', orderExpired: 'Zamówienie wygasło', orderCancelled: 'Zamówienie anulowane', orderStatusError: 'Nieprawidłowy status zamówienia', duplicateSubscription: 'Zduplikowane zamówienie subskrypcji', orderRefundedOrRevoked: 'Zamówienie zwrócone lub odwołane', orderRefunded: 'Zwrócono środki za zamówienie', orderRevoked: 'Zamówienie odwołane',
    missingParameters: 'Brakujące parametry', waitingForScan: 'Oczekiwanie na skanowanie', scannedWaitingForConfirmation: 'Zeskanowano. Oczekiwanie na potwierdzenie', qrCodeExpired: 'Kod QR wygasł',
    downloadCodeSent: 'Kod weryfikacyjny został wysłany', downloadCodeInvalid: 'Kod weryfikacyjny jest nieprawidłowy lub wygasł', downloadRecordNotFound: 'Nie znaleziono historii pobierania', userCancelled: 'Ten użytkownik został usunięty', accountBanned: 'Twoje konto zostało zablokowane. Skontaktuj się z obsługą klienta', userNotFound: 'Nie znaleziono użytkownika', userStatusNotCancelled: 'Konto nie jest w statusie usuniętym', signatureError: 'Błąd podpisu', accountCancellationWithdrawnFailed: 'Nie udało się wycofać usunięcia konta', activeSubscriptionCancellationRequired: 'Masz aktywną subskrypcję. Anuluj ją na odpowiedniej platformie przed usunięciem konta',
  },
  nl: {
    operationSuccess: 'Bewerking voltooid', operationFailed: 'Bewerking mislukt', tooManyRequests: 'Te veel pogingen. Probeer het later opnieuw',
    requestFailed: 'Aanvraag mislukt', invalidParameters: 'Ongeldige parameters', requiredField: 'Verplichte velden mogen niet leeg zijn', dataExists: 'Gegevens bestaan al', dataNotFound: 'Gegevens niet gevonden',
    unauthorized: 'Autorisatie mislukt. Meld u aan', sessionExpired: 'Uw sessie is verlopen. Meld u opnieuw aan', signedInElsewhere: 'Uw account is aangemeld op een ander apparaat. Meld u opnieuw aan', pageNotFound: 'Pagina niet gevonden', methodNotAllowed: 'HTTP-methode niet toegestaan',
    serverError: 'Serverfout', systemMaintenance: 'De server is in onderhoud en tijdelijk niet beschikbaar', cacheConfigError: 'Fout in cacheconfiguratie', cacheMiss: 'Niet gevonden in cache', systemConfigError: 'Fout in systeemconfiguratie', paymentConfigError: 'Betaalservice is niet geconfigureerd', serviceError: 'Servicefout', paymentOrderCreationFailed: 'Kan de betalingsorder niet aanmaken',
    registrationFailed: 'Registratie mislukt', loginFailed: 'Aanmelden mislukt', invalidCredentials: 'Onjuist account of wachtwoord', insufficientPoints: 'Onvoldoende punten', insufficientBalance: 'Onvoldoende saldo', socialAccountBindingRequired: 'Verifieer en koppel uw sociale account',
    loginSuccess: 'Succesvol aangemeld', logoutSuccess: 'Succesvol afgemeld', logoutFailed: 'Afmelden mislukt', registrationSuccess: 'Registratie voltooid', accountRegistered: 'Dit account is al geregistreerd', inviteCodeExists: 'Uitnodigingscode bestaat al', inviteCodeNotFound: 'Uitnodigingscode niet gevonden', invalidVerificationCode: 'Onjuiste verificatiecode', mobileNotFound: 'Telefoonnummer niet gevonden', inviteCodeAlreadySet: 'Er is al een uitnodigingscode ingevoerd', smsSent: 'SMS verzonden', smsFailed: 'SMS verzenden mislukt', emailSent: 'E-mail verzonden', emailFailed: 'E-mail verzenden mislukt',
    accountCancellationWithdrawn: 'Accountverwijdering ingetrokken', accountCancelled: 'Account verwijderd', accountCancellationFailed: 'Account verwijderen mislukt',
    invalidCard: 'Activeringscode niet gevonden of al geactiveerd', cardNotFound: 'Activeringscode niet gevonden', cardDisabled: 'Activeringscode is uitgeschakeld', cardExpired: 'Activeringscode is verlopen', alreadyLifetimeMember: 'Je hebt al een levenslang lidmaatschap en kunt geen andere kaarten activeren', alreadyLifetimeMemberNoPurchase: 'Je bent al lid voor het leven. Een nieuwe aankoop is niet nodig', productNotFound: 'Product niet gevonden', productPriceInvalid: 'De productprijs is niet geconfigureerd', orderCurrencyInvalid: 'Ongeldige valuta voor bestelling', orderAmountMismatch: 'Het betaalde bedrag komt niet overeen met het bestelbedrag', sanctionedCountry: 'Aankopen zijn niet beschikbaar in uw regio', orderCurrencyMismatch: 'De betalingsvaluta komt niet overeen met de ordervaluta',
    paymentSuccess: 'Betaling voltooid', paymentFailed: 'Betaling mislukt', orderNotFound: 'Bestelling niet gevonden', orderAlreadyPaid: 'Bestelling is al betaald', orderExpired: 'Bestelling is verlopen', orderCancelled: 'Bestelling geannuleerd', orderStatusError: 'Ongeldige bestelstatus', duplicateSubscription: 'Dubbele abonnementsbestelling', orderRefundedOrRevoked: 'Bestelling terugbetaald of ingetrokken', orderRefunded: 'Bestelling terugbetaald', orderRevoked: 'Bestelling ingetrokken',
    missingParameters: 'Ontbrekende parameters', waitingForScan: 'Wachten op scan', scannedWaitingForConfirmation: 'Gescand. Wachten op bevestiging', qrCodeExpired: 'QR-code is verlopen',
    downloadCodeSent: 'Verificatiecode verzonden', downloadCodeInvalid: 'Verificatiecode is ongeldig of verlopen', downloadRecordNotFound: 'Geen downloadrecord gevonden', userCancelled: 'Deze gebruiker is verwijderd', accountBanned: 'Je account is geblokkeerd. Neem contact op met de klantenservice', userNotFound: 'Gebruiker niet gevonden', userStatusNotCancelled: 'De accountstatus is niet verwijderd', signatureError: 'Handtekeningfout', accountCancellationWithdrawnFailed: 'Het verwijderen van het account kon niet worden ingetrokken', activeSubscriptionCancellationRequired: 'Je hebt een actief abonnement. Zeg het abonnement op op het betreffende platform voordat je je account verwijdert',
  },
  hi: {
    operationSuccess: 'कार्रवाई सफल रही', operationFailed: 'कार्रवाई विफल रही', tooManyRequests: 'बहुत अधिक प्रयास किए गए। कृपया बाद में पुनः प्रयास करें',
    requestFailed: 'अनुरोध विफल रहा', invalidParameters: 'अमान्य पैरामीटर', requiredField: 'आवश्यक फ़ील्ड खाली नहीं हो सकते', dataExists: 'डेटा पहले से मौजूद है', dataNotFound: 'डेटा नहीं मिला',
    unauthorized: 'प्राधिकरण विफल रहा। कृपया साइन इन करें', sessionExpired: 'आपका सत्र समाप्त हो गया है। कृपया फिर से साइन इन करें', signedInElsewhere: 'आपके खाते से किसी अन्य डिवाइस पर साइन इन किया गया है। कृपया फिर से साइन इन करें', pageNotFound: 'पेज नहीं मिला', methodNotAllowed: 'HTTP विधि की अनुमति नहीं है',
    serverError: 'सर्वर त्रुटि', systemMaintenance: 'सर्वर का रखरखाव चल रहा है और यह अस्थायी रूप से उपलब्ध नहीं है', cacheConfigError: 'कैश कॉन्फ़िगरेशन त्रुटि', cacheMiss: 'कैश में डेटा नहीं मिला', systemConfigError: 'सिस्टम कॉन्फ़िगरेशन त्रुटि', paymentConfigError: 'भुगतान सेवा कॉन्फ़िगर नहीं है', serviceError: 'सेवा त्रुटि', paymentOrderCreationFailed: 'भुगतान ऑर्डर बनाने में विफल रहा',
    registrationFailed: 'पंजीकरण विफल रहा', loginFailed: 'लॉगिन विफल रहा', invalidCredentials: 'खाता या पासवर्ड गलत है', insufficientPoints: 'पर्याप्त अंक नहीं हैं', insufficientBalance: 'पर्याप्त शेष राशि नहीं है', socialAccountBindingRequired: 'कृपया अपने सोशल खाते को सत्यापित और लिंक करें',
    loginSuccess: 'सफलतापूर्वक लॉगिन किया गया', logoutSuccess: 'सफलतापूर्वक लॉगआउट किया गया', logoutFailed: 'लॉगआउट विफल रहा', registrationSuccess: 'पंजीकरण सफल रहा', accountRegistered: 'यह खाता पहले से पंजीकृत है', inviteCodeExists: 'आमंत्रण कोड पहले से मौजूद है', inviteCodeNotFound: 'आमंत्रण कोड नहीं मिला', invalidVerificationCode: 'सत्यापन कोड गलत है', mobileNotFound: 'मोबाइल नंबर नहीं मिला', inviteCodeAlreadySet: 'आमंत्रण कोड पहले ही दर्ज किया जा चुका है', smsSent: 'SMS सफलतापूर्वक भेजा गया', smsFailed: 'SMS भेजना विफल रहा', emailSent: 'ईमेल सफलतापूर्वक भेजा गया', emailFailed: 'ईमेल भेजना विफल रहा',
    accountCancellationWithdrawn: 'खाता रद्द करने का अनुरोध वापस ले लिया गया', accountCancelled: 'खाता सफलतापूर्वक रद्द किया गया', accountCancellationFailed: 'खाता रद्द करना विफल रहा',
    invalidCard: 'सक्रियण कोड नहीं मिला या पहले ही सक्रिय किया जा चुका है', cardNotFound: 'सक्रियण कोड नहीं मिला', cardDisabled: 'सक्रियण कोड अक्षम कर दिया गया है', cardExpired: 'सक्रियण कोड की समय-सीमा समाप्त हो गई है', alreadyLifetimeMember: 'आप पहले से ही आजीवन सदस्य हैं, अन्य कार्ड सक्रिय नहीं कर सकते', alreadyLifetimeMemberNoPurchase: 'आप पहले से ही आजीवन सदस्य हैं। दोबारा खरीदने की आवश्यकता नहीं है', productNotFound: 'उत्पाद नहीं मिला', productPriceInvalid: 'उत्पाद की कीमत कॉन्फ़िगर नहीं की गई है', orderCurrencyInvalid: 'ऑर्डर मुद्रा अमान्य है', orderAmountMismatch: 'भुगतान राशि ऑर्डर राशि से मेल नहीं खाती', sanctionedCountry: 'आपके क्षेत्र में खरीदारी उपलब्ध नहीं है', orderCurrencyMismatch: 'भुगतान मुद्रा ऑर्डर मुद्रा से मेल नहीं खाती',
    paymentSuccess: 'भुगतान सफल रहा', paymentFailed: 'भुगतान विफल रहा', orderNotFound: 'ऑर्डर नहीं मिला', orderAlreadyPaid: 'ऑर्डर का भुगतान पहले ही किया जा चुका है', orderExpired: 'ऑर्डर की समय-सीमा समाप्त हो गई है', orderCancelled: 'ऑर्डर रद्द कर दिया गया है', orderStatusError: 'ऑर्डर की स्थिति अमान्य है', duplicateSubscription: 'डुप्लिकेट सदस्यता ऑर्डर', orderRefundedOrRevoked: 'ऑर्डर का धनवापसी या निरस्तीकरण हो गया है', orderRefunded: 'ऑर्डर का धनवापसी सफल रहा', orderRevoked: 'ऑर्डर निरस्त कर दिया गया है',
    missingParameters: 'पैरामीटर अनुपलब्ध हैं', waitingForScan: 'स्कैन की प्रतीक्षा है', scannedWaitingForConfirmation: 'स्कैन हो गया। पुष्टि की प्रतीक्षा है', qrCodeExpired: 'QR कोड की समय-सीमा समाप्त हो गई है',
    downloadCodeSent: 'सत्यापन कोड भेज दिया गया है', downloadCodeInvalid: 'सत्यापन कोड अमान्य है या उसकी समय-सीमा समाप्त हो गई है', downloadRecordNotFound: 'डाउनलोड रिकॉर्ड नहीं मिला', userCancelled: 'यह उपयोगकर्ता रद्द कर दिया गया है', accountBanned: 'आपका खाता प्रतिबंधित कर दिया गया है। कृपया ग्राहक सहायता से संपर्क करें', userNotFound: 'उपयोगकर्ता नहीं मिला', userStatusNotCancelled: 'खाता रद्द स्थिति में नहीं है', signatureError: 'हस्ताक्षर त्रुटि', accountCancellationWithdrawnFailed: 'खाता रद्द करने का अनुरोध वापस लेने में विफल', activeSubscriptionCancellationRequired: 'आपकी सक्रिय सदस्यता है। कृपया खाता रद्द करने से पहले संबंधित प्लेटफ़ॉर्म पर सदस्यता रद्द करें',
  },
  ur: {
    operationSuccess: 'کارروائی کامیاب رہی', operationFailed: 'کارروائی ناکام رہی', tooManyRequests: 'بہت زیادہ کوششیں کی گئی ہیں۔ براہ کرم بعد میں دوبارہ کوشش کریں',
    requestFailed: 'درخواست ناکام رہی', invalidParameters: 'غلط پیرامیٹرز', requiredField: 'ضروری خانے خالی نہیں ہو سکتے', dataExists: 'ڈیٹا پہلے سے موجود ہے', dataNotFound: 'ڈیٹا نہیں ملا',
    unauthorized: 'اجازت ناکام رہی۔ براہ کرم سائن ان کریں', sessionExpired: 'آپ کا سیشن ختم ہو گیا ہے۔ دوبارہ سائن ان کریں', signedInElsewhere: 'آپ کا اکاؤنٹ کسی دوسرے آلے پر سائن ان ہوا ہے۔ دوبارہ سائن ان کریں', pageNotFound: 'صفحہ نہیں ملا', methodNotAllowed: 'HTTP طریقہ اجازت یافتہ نہیں ہے',
    serverError: 'سرور کی خرابی', systemMaintenance: 'سرور کی دیکھ بھال جاری ہے اور عارضی طور پر دستیاب نہیں', cacheConfigError: 'کیش کی ترتیب میں خرابی', cacheMiss: 'کیش میں ڈیٹا نہیں ملا', systemConfigError: 'سسٹم کی ترتیب میں خرابی', paymentConfigError: 'ادائیگی کی سروس ترتیب نہیں دی گئی', serviceError: 'سروس کی خرابی', paymentOrderCreationFailed: 'ادائیگی کا آرڈر بنانے میں ناکامی',
    registrationFailed: 'رجسٹریشن ناکام رہی', loginFailed: 'لاگ ان ناکام رہا', invalidCredentials: 'اکاؤنٹ یا پاس ورڈ غلط ہے', insufficientPoints: 'پوائنٹس ناکافی ہیں', insufficientBalance: 'بیلنس ناکافی ہے', socialAccountBindingRequired: 'اپنے سوشل اکاؤنٹ کی تصدیق اور اسے منسلک کریں',
    loginSuccess: 'کامیابی سے لاگ ان ہو گئے', logoutSuccess: 'کامیابی سے لاگ آؤٹ ہو گئے', logoutFailed: 'لاگ آؤٹ ناکام رہا', registrationSuccess: 'رجسٹریشن کامیاب رہی', accountRegistered: 'یہ اکاؤنٹ پہلے سے رجسٹرڈ ہے', inviteCodeExists: 'دعوتی کوڈ پہلے سے موجود ہے', inviteCodeNotFound: 'دعوتی کوڈ نہیں ملا', invalidVerificationCode: 'تصدیقی کوڈ غلط ہے', mobileNotFound: 'موبائل نمبر نہیں ملا', inviteCodeAlreadySet: 'دعوتی کوڈ پہلے ہی درج کیا جا چکا ہے', smsSent: 'SMS کامیابی سے بھیج دیا گیا', smsFailed: 'SMS بھیجنے میں ناکامی', emailSent: 'ای میل کامیابی سے بھیج دی گئی', emailFailed: 'ای میل بھیجنے میں ناکامی',
    accountCancellationWithdrawn: 'اکاؤنٹ منسوخی واپس لے لی گئی', accountCancelled: 'اکاؤنٹ کامیابی سے منسوخ کر دیا گیا', accountCancellationFailed: 'اکاؤنٹ منسوخ نہیں ہو سکا',
    invalidCard: 'ایکٹیویشن کوڈ نہیں ملا یا پہلے ہی فعال ہو چکا ہے', cardNotFound: 'ایکٹیویشن کوڈ نہیں ملا', cardDisabled: 'ایکٹیویشن کوڈ غیر فعال کر دیا گیا ہے', cardExpired: 'ایکٹیویشن کوڈ کی میعاد ختم ہو گئی ہے', alreadyLifetimeMember: 'آپ پہلے سے تاحیات رکن ہیں، دوسرے کارڈ فعال نہیں کر سکتے', alreadyLifetimeMemberNoPurchase: 'آپ پہلے ہی تاحیات رکن ہیں۔ دوبارہ خریدنے کی ضرورت نہیں', productNotFound: 'پروڈکٹ نہیں ملی', productPriceInvalid: 'پروڈکٹ کی قیمت ترتیب نہیں دی گئی', orderCurrencyInvalid: 'آرڈر کرنسی درست نہیں', orderAmountMismatch: 'ادائیگی کی رقم آرڈر کی رقم سے مطابقت نہیں رکھتی', sanctionedCountry: 'آپ کے علاقے میں خریداری دستیاب نہیں ہے', orderCurrencyMismatch: 'ادائیگی کرنسی آرڈر کرنسی سے مطابقت نہیں رکھتی',
    paymentSuccess: 'ادائیگی کامیاب رہی', paymentFailed: 'ادائیگی ناکام رہی', orderNotFound: 'آرڈر نہیں ملا', orderAlreadyPaid: 'آرڈر کی ادائیگی پہلے ہی ہو چکی ہے', orderExpired: 'آرڈر کی میعاد ختم ہو گئی ہے', orderCancelled: 'آرڈر منسوخ کر دیا گیا', orderStatusError: 'آرڈر کی حالت غلط ہے', duplicateSubscription: 'دہرایا گیا سبسکرپشن آرڈر', orderRefundedOrRevoked: 'آرڈر واپس یا منسوخ کر دیا گیا', orderRefunded: 'آرڈر کی رقم کامیابی سے واپس کر دی گئی', orderRevoked: 'آرڈر منسوخ کر دیا گیا',
    missingParameters: 'پیرامیٹرز موجود نہیں', waitingForScan: 'اسکین کا انتظار ہے', scannedWaitingForConfirmation: 'اسکین ہو گیا۔ تصدیق کا انتظار ہے', qrCodeExpired: 'QR کوڈ کی میعاد ختم ہو گئی ہے',
    downloadCodeSent: 'تصدیقی کوڈ بھیج دیا گیا', downloadCodeInvalid: 'تصدیقی کوڈ غلط ہے یا اس کی میعاد ختم ہو گئی ہے', downloadRecordNotFound: 'ڈاؤن لوڈ ریکارڈ نہیں ملا', userCancelled: 'یہ صارف منسوخ ہو چکا ہے', accountBanned: 'آپ کا اکاؤنٹ بلاک کر دیا گیا ہے۔ براہ کرم کسٹمر سپورٹ سے رابطہ کریں', userNotFound: 'صارف نہیں ملا', userStatusNotCancelled: 'اکاؤنٹ منسوخ شدہ حالت میں نہیں ہے', signatureError: 'دستخط کی غلطی', accountCancellationWithdrawnFailed: 'اکاؤنٹ منسوخی واپس لینے میں ناکامی', activeSubscriptionCancellationRequired: 'آپ کا فعال سبسکرپشن ہے۔ براہ کرم اکاؤنٹ منسوخ کرنے سے پہلے متعلقہ پلیٹ فارم پر سبسکرپشن منسوخ کریں',
  },
  bn: {
    operationSuccess: 'অপারেশন সফল হয়েছে', operationFailed: 'অপারেশন ব্যর্থ হয়েছে', tooManyRequests: 'অনেক বেশি চেষ্টা করা হয়েছে। পরে আবার চেষ্টা করুন',
    requestFailed: 'অনুরোধ ব্যর্থ হয়েছে', invalidParameters: 'অবৈধ প্যারামিটার', requiredField: 'আবশ্যিক ঘর খালি রাখা যাবে না', dataExists: 'ডেটা ইতিমধ্যে আছে', dataNotFound: 'ডেটা পাওয়া যায়নি',
    unauthorized: 'অনুমোদন ব্যর্থ হয়েছে। সাইন ইন করুন', sessionExpired: 'আপনার সেশনের মেয়াদ শেষ হয়েছে। আবার সাইন ইন করুন', signedInElsewhere: 'আপনার অ্যাকাউন্ট অন্য ডিভাইসে সাইন ইন করা হয়েছে। আবার সাইন ইন করুন', pageNotFound: 'পৃষ্ঠা পাওয়া যায়নি', methodNotAllowed: 'HTTP পদ্ধতি অনুমোদিত নয়',
    serverError: 'সার্ভার ত্রুটি', systemMaintenance: 'সার্ভার রক্ষণাবেক্ষণ চলছে এবং সাময়িকভাবে অনুপলব্ধ', cacheConfigError: 'ক্যাশ কনফিগারেশন ত্রুটি', cacheMiss: 'ক্যাশে ডেটা পাওয়া যায়নি', systemConfigError: 'সিস্টেম কনফিগারেশন ত্রুটি', paymentConfigError: 'পেমেন্ট সেবা কনফিগার করা নেই', serviceError: 'সার্ভিস ত্রুটি', paymentOrderCreationFailed: 'পেমেন্ট অর্ডার তৈরি করা যায়নি',
    registrationFailed: 'নিবন্ধন ব্যর্থ হয়েছে', loginFailed: 'লগইন ব্যর্থ হয়েছে', invalidCredentials: 'অ্যাকাউন্ট বা পাসওয়ার্ড ভুল', insufficientPoints: 'পর্যাপ্ত পয়েন্ট নেই', insufficientBalance: 'পর্যাপ্ত ব্যালেন্স নেই', socialAccountBindingRequired: 'আপনার সামাজিক অ্যাকাউন্ট যাচাই করে সংযুক্ত করুন',
    loginSuccess: 'সফলভাবে লগইন হয়েছে', logoutSuccess: 'সফলভাবে লগআউট হয়েছে', logoutFailed: 'লগআউট ব্যর্থ হয়েছে', registrationSuccess: 'নিবন্ধন সফল হয়েছে', accountRegistered: 'এই অ্যাকাউন্টটি ইতিমধ্যে নিবন্ধিত', inviteCodeExists: 'আমন্ত্রণ কোড ইতিমধ্যে আছে', inviteCodeNotFound: 'আমন্ত্রণ কোড পাওয়া যায়নি', invalidVerificationCode: 'যাচাইকরণ কোড ভুল', mobileNotFound: 'মোবাইল নম্বর পাওয়া যায়নি', inviteCodeAlreadySet: 'আমন্ত্রণ কোড ইতিমধ্যে দেওয়া হয়েছে', smsSent: 'SMS সফলভাবে পাঠানো হয়েছে', smsFailed: 'SMS পাঠানো ব্যর্থ হয়েছে', emailSent: 'ইমেল সফলভাবে পাঠানো হয়েছে', emailFailed: 'ইমেল পাঠানো ব্যর্থ হয়েছে',
    accountCancellationWithdrawn: 'অ্যাকাউন্ট বাতিলের আবেদন প্রত্যাহার করা হয়েছে', accountCancelled: 'অ্যাকাউন্ট সফলভাবে বাতিল হয়েছে', accountCancellationFailed: 'অ্যাকাউন্ট বাতিল করা ব্যর্থ হয়েছে',
    invalidCard: 'অ্যাক্টিভেশন কোড পাওয়া যায়নি বা ইতিমধ্যে সক্রিয় করা হয়েছে', cardNotFound: 'অ্যাক্টিভেশন কোড পাওয়া যায়নি', cardDisabled: 'অ্যাক্টিভেশন কোড নিষ্ক্রিয় করা হয়েছে', cardExpired: 'অ্যাক্টিভেশন কোডের মেয়াদ শেষ হয়েছে', alreadyLifetimeMember: 'আপনি ইতিমধ্যে আজীবন সদস্য, অন্য কার্ড সক্রিয় করতে পারবেন না', alreadyLifetimeMemberNoPurchase: 'আপনি ইতিমধ্যে আজীবন সদস্য। আবার কেনার প্রয়োজন নেই', productNotFound: 'পণ্য পাওয়া যায়নি', productPriceInvalid: 'পণ্যের মূল্য কনফিগার করা হয়নি', orderCurrencyInvalid: 'অর্ডার মুদ্রা অবৈধ', orderAmountMismatch: 'পেমেন্টের পরিমাণ অর্ডারের পরিমাণের সাথে মেলে না', sanctionedCountry: 'আপনার অঞ্চলে কেনাকাটা উপলব্ধ নয়', orderCurrencyMismatch: 'পেমেন্ট মুদ্রা অর্ডার মুদ্রার সাথে মেলে না',
    paymentSuccess: 'পেমেন্ট সফল হয়েছে', paymentFailed: 'পেমেন্ট ব্যর্থ হয়েছে', orderNotFound: 'অর্ডার পাওয়া যায়নি', orderAlreadyPaid: 'অর্ডারটি ইতিমধ্যে পরিশোধ করা হয়েছে', orderExpired: 'অর্ডারের মেয়াদ শেষ হয়েছে', orderCancelled: 'অর্ডার বাতিল হয়েছে', orderStatusError: 'অর্ডারের অবস্থা অবৈধ', duplicateSubscription: 'একই সাবস্ক্রিপশন অর্ডার আবার করা হয়েছে', orderRefundedOrRevoked: 'অর্ডারের অর্থ ফেরত বা অর্ডার প্রত্যাহার হয়েছে', orderRefunded: 'অর্ডারের অর্থ সফলভাবে ফেরত দেওয়া হয়েছে', orderRevoked: 'অর্ডার প্রত্যাহার করা হয়েছে',
    missingParameters: 'প্যারামিটার অনুপস্থিত', waitingForScan: 'স্ক্যানের অপেক্ষায়', scannedWaitingForConfirmation: 'স্ক্যান হয়েছে। নিশ্চিতকরণের অপেক্ষায়', qrCodeExpired: 'QR কোডের মেয়াদ শেষ হয়েছে',
    downloadCodeSent: 'যাচাইকরণ কোড পাঠানো হয়েছে', downloadCodeInvalid: 'যাচাইকরণ কোড অবৈধ বা মেয়াদ শেষ হয়েছে', downloadRecordNotFound: 'ডাউনলোড রেকর্ড পাওয়া যায়নি', userCancelled: 'এই ব্যবহারকারী বাতিল হয়ে গেছে', accountBanned: 'আপনার অ্যাকাউন্ট ব্লক করা হয়েছে। অনুগ্রহ করে গ্রাহক সহায়তার সাথে যোগাযোগ করুন', userNotFound: 'ব্যবহারকারী পাওয়া যায়নি', userStatusNotCancelled: 'অ্যাকাউন্ট বাতিল অবস্থায় নেই', signatureError: 'স্বাক্ষর ত্রুটি', accountCancellationWithdrawnFailed: 'অ্যাকাউন্ট বাতিলের অনুরোধ প্রত্যাহার করতে ব্যর্থ হয়েছে', activeSubscriptionCancellationRequired: 'আপনার সক্রিয় সাবস্ক্রিপশন আছে। অ্যাকাউন্ট বাতিল করার আগে অনুগ্রহ করে সংশ্লিষ্ট প্ল্যাটফর্মে সাবস্ক্রিপশন বাতিল করুন',
  },
  fa: {
    operationSuccess: 'عملیات با موفقیت انجام شد', operationFailed: 'عملیات ناموفق بود', tooManyRequests: 'تعداد تلاش‌ها زیاد است. لطفاً بعداً دوباره امتحان کنید',
    requestFailed: 'درخواست ناموفق بود', invalidParameters: 'پارامترهای نامعتبر', requiredField: 'فیلدهای الزامی نمی‌توانند خالی باشند', dataExists: 'داده از قبل وجود دارد', dataNotFound: 'داده پیدا نشد',
    unauthorized: 'مجوز ناموفق بود. لطفاً وارد شوید', sessionExpired: 'نشست شما منقضی شده است. دوباره وارد شوید', signedInElsewhere: 'حساب شما در دستگاه دیگری وارد شده است. دوباره وارد شوید', pageNotFound: 'صفحه پیدا نشد', methodNotAllowed: 'روش HTTP مجاز نیست',
    serverError: 'خطای سرور', systemMaintenance: 'سرور در حال تعمیر است و موقتاً در دسترس نیست', cacheConfigError: 'خطای پیکربندی حافظه پنهان', cacheMiss: 'داده در حافظه پنهان پیدا نشد', systemConfigError: 'خطای پیکربندی سیستم', paymentConfigError: 'سرویس پرداخت پیکربندی نشده است', serviceError: 'خطای سرویس', paymentOrderCreationFailed: 'ایجاد سفارش پرداخت ناموفق بود',
    registrationFailed: 'ثبت‌نام ناموفق بود', loginFailed: 'ورود ناموفق بود', invalidCredentials: 'حساب یا رمز عبور نادرست است', insufficientPoints: 'امتیاز کافی نیست', insufficientBalance: 'موجودی کافی نیست', socialAccountBindingRequired: 'حساب اجتماعی خود را تأیید و متصل کنید',
    loginSuccess: 'با موفقیت وارد شدید', logoutSuccess: 'با موفقیت خارج شدید', logoutFailed: 'خروج ناموفق بود', registrationSuccess: 'ثبت‌نام با موفقیت انجام شد', accountRegistered: 'این حساب قبلاً ثبت شده است', inviteCodeExists: 'کد دعوت از قبل وجود دارد', inviteCodeNotFound: 'کد دعوت پیدا نشد', invalidVerificationCode: 'کد تأیید نادرست است', mobileNotFound: 'شماره موبایل پیدا نشد', inviteCodeAlreadySet: 'کد دعوت قبلاً وارد شده است', smsSent: 'پیامک با موفقیت ارسال شد', smsFailed: 'ارسال پیامک ناموفق بود', emailSent: 'ایمیل با موفقیت ارسال شد', emailFailed: 'ارسال ایمیل ناموفق بود',
    accountCancellationWithdrawn: 'درخواست حذف حساب پس گرفته شد', accountCancelled: 'حساب با موفقیت حذف شد', accountCancellationFailed: 'حذف حساب ناموفق بود',
    invalidCard: 'کد فعال‌سازی پیدا نشد یا قبلاً فعال شده است', cardNotFound: 'کد فعال‌سازی پیدا نشد', cardDisabled: 'کد فعال‌سازی غیرفعال شده است', cardExpired: 'کد فعال‌سازی منقضی شده است', alreadyLifetimeMember: 'شما قبلاً عضو مادام‌العمر هستید و نمی‌توانید کارت دیگری فعال کنید', alreadyLifetimeMemberNoPurchase: 'شما قبلاً عضو مادام‌العمر هستید. نیازی به خرید مجدد نیست', productNotFound: 'محصول پیدا نشد', productPriceInvalid: 'قیمت محصول پیکربندی نشده است', orderCurrencyInvalid: 'ارز سفارش نامعتبر است', orderAmountMismatch: 'مبلغ پرداخت با مبلغ سفارش مطابقت ندارد', sanctionedCountry: 'خرید در منطقه شما در دسترس نیست', orderCurrencyMismatch: 'ارز پرداخت با ارز سفارش مطابقت ندارد',
    paymentSuccess: 'پرداخت با موفقیت انجام شد', paymentFailed: 'پرداخت ناموفق بود', orderNotFound: 'سفارش پیدا نشد', orderAlreadyPaid: 'سفارش قبلاً پرداخت شده است', orderExpired: 'سفارش منقضی شده است', orderCancelled: 'سفارش لغو شده است', orderStatusError: 'وضعیت سفارش نامعتبر است', duplicateSubscription: 'سفارش اشتراک تکراری است', orderRefundedOrRevoked: 'مبلغ سفارش بازپرداخت یا سفارش لغو شده است', orderRefunded: 'مبلغ سفارش با موفقیت بازپرداخت شد', orderRevoked: 'سفارش لغو شده است',
    missingParameters: 'پارامترها موجود نیستند', waitingForScan: 'در انتظار اسکن', scannedWaitingForConfirmation: 'اسکن شد. در انتظار تأیید', qrCodeExpired: 'کد QR منقضی شده است',
    downloadCodeSent: 'کد تأیید ارسال شد', downloadCodeInvalid: 'کد تأیید نامعتبر یا منقضی شده است', downloadRecordNotFound: 'سابقه دانلود پیدا نشد', userCancelled: 'این کاربر حذف شده است', accountBanned: 'حساب شما مسدود شده است. لطفاً با پشتیبانی مشتری تماس بگیرید', userNotFound: 'کاربر یافت نشد', userStatusNotCancelled: 'وضعیت حساب حذف‌شده نیست', signatureError: 'خطای امضا', accountCancellationWithdrawnFailed: 'بازگرداندن درخواست حذف حساب ناموفق بود', activeSubscriptionCancellationRequired: 'شما اشتراک فعالی دارید. لطفاً قبل از حذف حساب، اشتراک را در پلتفرم مربوطه لغو کنید',
  },
}

const LEGACY_SUCCESS_CODES = new Set([0, 200])

// 个别接口失败时返回 {status:"fail", code:null, data:[code, message]} 的数组形态，
// 这里从 data 数组里兜底提取业务码，避免失败响应被误当成成功。
const getArrayResponseCode = (payload) => {
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.data)) {
    return null
  }

  const [code] = payload.data
  const numericCode = Number(code)

  return Number.isFinite(numericCode) ? numericCode : null
}

// 后端 message 字段兜底：标准形态取 error.message / data.message / message，
// 数组形态取 data[1]。
const getApiResponseBackendMessage = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return ''
  }

  if (Array.isArray(payload.data)) {
    return String(payload.data[1] ?? '').trim()
  }

  return String(payload?.error?.message || payload?.data?.message || payload?.message || '').trim()
}

const isKnownApiResponseCode = (code, scope) => {
  return Boolean(
    LEGACY_SUCCESS_CODES.has(code) ||
    GENERAL_RESPONSE_CODES[code] ||
    SCOPED_RESPONSE_CODES[scope]?.[code]
  )
}

const findResponseValue = (payload, key, depth = 0) => {
  if (!payload || typeof payload !== 'object' || depth > 5) {
    return undefined
  }

  if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
    return payload[key]
  }

  for (const nestedKey of ['data', 'error', 'raw', 'response']) {
    const value = findResponseValue(payload[nestedKey], key, depth + 1)

    if (value !== undefined) {
      return value
    }
  }

  return undefined
}

export const getApiResponseCode = payload => {
  const code = findResponseValue(payload, 'code')
  const numericCode = Number(code)

  if (Number.isFinite(numericCode)) {
    return numericCode
  }

  return getArrayResponseCode(payload)
}

export const getApiResponseDefinition = (payload, scope = 'general') => {
  const code = getApiResponseCode(payload)

  if (code === null) {
    return null
  }

  if (LEGACY_SUCCESS_CODES.has(code)) {
    return { code, key: 'operationSuccess', type: 'success', scope: 'general' }
  }

  const scopedDefinition = SCOPED_RESPONSE_CODES[scope]?.[code]
  const generalDefinition = GENERAL_RESPONSE_CODES[code]
  const definition = scopedDefinition || generalDefinition

  if (definition) {
    return {
      code,
      key: definition[0],
      type: definition[1],
      scope: scopedDefinition ? scope : 'general',
    }
  }

  return {
    code,
    key: 'operationFailed',
    type: 'error',
    scope,
  }
}

export const isApiResponseError = (payload, scope) => {
  return getApiResponseDefinition(payload, scope)?.type === 'error'
}

const getMessageOverride = (messages, definition, messageKey) => {
  if (Array.isArray(messages)) {
    const item = messages.find(candidate => {
      return String(candidate?.code ?? '') === String(definition?.code ?? '') || candidate?.key === messageKey
    })

    return item?.message || item?.text || item?.label || ''
  }

  if (!messages || typeof messages !== 'object') {
    return ''
  }

  return (definition && (messages[definition.code] || messages[String(definition.code)])) || messages[messageKey] || ''
}

export const getApiResponseMessage = (payload, {
  locale = 'en',
  scope = 'general',
  messages = {},
  fallback = '',
  useLocalMessages = true,
} = {}) => {
  const definition = getApiResponseDefinition(payload, scope)
  const directKey = payload?.responseKey

  if (!definition && !directKey) {
    return String(fallback || '').trim()
  }

  const localeMessages = useLocalMessages ? API_RESPONSE_MESSAGES[locale] : {}
  const messageKey = definition?.key || directKey
  const code = definition?.code ?? null
  const useBackendMessage = code !== null && !isKnownApiResponseCode(code, scope)
  return String(
    getMessageOverride(messages, definition, messageKey) ||
    (useBackendMessage ? getApiResponseBackendMessage(payload) : localeMessages?.[messageKey]) ||
    fallback ||
    (useLocalMessages ? API_RESPONSE_MESSAGES.en[messageKey] : '') ||
    ''
  ).trim()
}

export const createApiResponseError = (response, scope = 'general') => {
  const definition = getApiResponseDefinition(response, scope)
  const error = new Error(definition?.key || 'operationFailed')

  error.name = 'ApiResponseError'
  error.code = definition?.code ?? null
  error.responseCode = definition?.code ?? null
  error.responseKey = definition?.key || 'operationFailed'
  error.responseScope = scope
  error.data = response

  return error
}
