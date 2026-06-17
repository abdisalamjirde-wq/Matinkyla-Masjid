import { Member, Transaction } from './types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: '#MM-0482',
    name: 'Ahmed Al-Farsi',
    phone: '+358 40 123 4567',
    monthlyFee: 50.00,
    status: 'Paid',
    lastPaymentDate: 'Oct 02, 2023',
    paymentHistory: [
      { date: 'Oct 02, 2023', amount: 50.00, description: 'Monthly Member Fee', category: 'Membership' },
      { date: 'Sep 01, 2023', amount: 50.00, description: 'Monthly Member Fee', category: 'Membership' },
    ]
  },
  {
    id: '#MM-0911',
    name: 'Mohamed Khan',
    phone: '+358 45 987 6543',
    monthlyFee: 35.00,
    status: 'Overdue',
    lastPaymentDate: 'Aug 28, 2023',
    paymentHistory: [
      { date: 'Aug 28, 2023', amount: 35.00, description: 'Monthly Member Fee', category: 'Membership' },
    ]
  },
  {
    id: '#MM-1024',
    name: 'Sarah Jameel',
    phone: '+358 50 444 2211',
    monthlyFee: 100.00,
    status: 'Unpaid',
    lastPaymentDate: 'Sep 15, 2023',
    paymentHistory: [
      { date: 'Sep 15, 2023', amount: 100.00, description: 'Monthly Member Fee', category: 'Membership' },
    ]
  },
  {
    id: '#MM-0552',
    name: 'Omar Ibrahim',
    phone: '+358 41 555 1234',
    monthlyFee: 20.00,
    status: 'Paid',
    lastPaymentDate: 'Oct 05, 2023',
    paymentHistory: [
      { date: 'Oct 05, 2023', amount: 20.00, description: 'Monthly Member Fee', category: 'Membership' },
    ]
  },
  {
    id: '#M-2024-001',
    name: 'Ahmed Hassan',
    phone: '+358 40 999 1111',
    monthlyFee: 50.00,
    status: 'Paid',
    lastPaymentDate: 'Oct 12, 2023',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk3DjaP_7Xl2LxXXHs_37qu2TW2drJKgbzQMrVDOD6e-YwtPnKYixf5vjrlkbLAch-Nembf9znRbIUQ4kRChoynn9pS3tWnRSkBhOR571Y-tenesBeVrLCpBh3q7EDVMFHBdBpQskcIaVLJSxD9ktRzZnvXKI4rJAKLzXUl1Z5hQlSt_yDk1jFssKxa7-dCCLb_S_9IJ4TrKVSu6DPRjiLXBHBY44qCUB-idAr9HFRXM5uNhV7JTQ0PbCQiZgX3yXqbTyFhpur2Zw',
    paymentHistory: [
      { date: 'Oct 12, 2023', amount: 50.00, description: 'Monthly Donation', category: 'Membership' }
    ]
  },
  {
    id: '#M-2024-042',
    name: 'Omar Farooq',
    phone: '+358 45 888 2222',
    monthlyFee: 120.00,
    status: 'Overdue',
    lastPaymentDate: 'Sep 10, 2023',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2t2llmpQMhRojrDz-HbHkyNVf0oqfs48LEvZwa3AVw55yymBax0ON1GE72Agqg87GDg79JeRw3hJbIJ5eEDxbIkQU97JidVDw_C-_3TcUgVnAu3YEd9jiXxHlgG0xfsneQHnSA5FdYMYkqi27OqdLpkfI68Um9I6YK9ftOZ1ixDSIuOZrm9EWxxzvhZ59X6qUP3-4p7JmqNmI_zURtSY8mRWkcFXmiRLWQQGGhREwzWItaOxWhLiLosw4xzttXsTY_bzttHvuyec',
    paymentHistory: [
      { date: 'Sep 10, 2023', amount: 120.00, description: 'Monthly Donation Contribution', category: 'Membership' }
    ]
  },
  {
    id: '#M-2024-089',
    name: 'Fatima Zahra',
    phone: '+358 41 777 3333',
    monthlyFee: 75.00,
    status: 'Unpaid',
    lastPaymentDate: 'Sep 01, 2023',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbHl3EnZ1-fniiwvIrukYt7fW0vuUES3F-rxbGPhdegMXfXmemlmzN_HjHPykOo7FgJtEbBuKYMrqZAULxw2KZHA3__oyIthlyAjnIURZJ24x2GZOn7oDqngh_PtliAMNVWyUKPHTOwue3kqD-SJ5rhlRhxDfufgtICuRrkVJMUsgRNKME6OXYECK0-IIfvELAKoCtHgkGRUZIjshrktzwcvh4cuz1fMUOMeTzdNzUn8SXdsb1YO263IaoJQyABtAJ_Iro3qgUB30',
    paymentHistory: []
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-1001',
    date: 'Oct 12, 2023',
    description: 'Monthly Donation',
    fromOrTo: 'Ali Khan',
    category: 'Membership',
    amount: 50.00,
    status: 'Completed'
  },
  {
    id: 'TX-1002',
    date: 'Oct 11, 2023',
    description: 'Maintenance Fund',
    fromOrTo: 'Roof repair contribution',
    category: 'Sadaqah',
    amount: 250.00,
    status: 'Completed'
  },
  {
    id: 'TX-1003',
    date: 'Oct 10, 2023',
    description: 'Zakat al-Maal',
    fromOrTo: 'Anonymous bank transfer',
    category: 'Zakat',
    amount: 1500.00,
    status: 'Completed'
  },
  {
    id: 'TX-1004',
    date: 'Oct 10, 2023',
    description: 'Utility Payment (Electricity Bill - Sep)',
    fromOrTo: 'Helen Sähköverkko Oy',
    category: 'Expense',
    amount: -340.20,
    status: 'Paid'
  },
  {
    id: 'TX-1005',
    date: 'Oct 09, 2023',
    description: 'Friday Collection',
    fromOrTo: 'Cash in hand',
    category: 'Jummah',
    amount: 840.00,
    status: 'Completed'
  },
  {
    id: 'TX-1006',
    date: 'Oct 24, 2023',
    description: 'Friday Sadaqa Collection',
    fromOrTo: 'Bank Transfer - Ref: #5521',
    category: 'Sadaqah',
    amount: 1240.00,
    status: 'Completed',
    ref: '#5521'
  },
  {
    id: 'TX-1007',
    date: 'Oct 22, 2023',
    description: 'Helen Sähköverkko Oy (Electricity Bill - Oct)',
    fromOrTo: 'Helen Sähköverkko Oy',
    category: 'Expense',
    amount: -245.50,
    status: 'Paid'
  },
  {
    id: 'TX-1008',
    date: 'Oct 20, 2023',
    description: 'Member ID #20412 Monthly Membership Fee',
    fromOrTo: 'Ahmed Al-Farsi',
    category: 'Membership',
    amount: 120.00,
    status: 'Completed'
  },
  {
    id: 'TX-1009',
    date: 'Oct 18, 2023',
    description: 'HSY Vesi (Water Utility Q3)',
    fromOrTo: 'HSY Vesi',
    category: 'Expense',
    amount: -180.20,
    status: 'Pending'
  },
  {
    id: 'TX-1010',
    date: 'Oct 15, 2023',
    description: 'Anonymous Donation',
    fromOrTo: 'Cash Deposit',
    category: 'Sadaqah',
    amount: 500.00,
    status: 'Completed'
  },
  {
    id: 'TX-1011',
    date: 'Oct 12, 2023',
    description: 'Facility Maintenance (Roof repair works)',
    fromOrTo: 'Facility Maintenance',
    category: 'Expense',
    amount: -1200.00,
    status: 'Paid'
  }
];
