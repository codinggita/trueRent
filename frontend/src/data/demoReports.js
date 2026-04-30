const generateDates = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const demoReports = [
  {
    _id: '1',
    property: {
      _id: 'p1',
      title: 'Luxury 2BHK in South Mumbai',
      owner: { name: 'Rajesh Khanna', email: 'rajesh@example.com' },
      price: 15000,
      fraudScore: 85,
      riskLevel: 'high',
      riskReasons: ['Price is 70% below market average', 'Duplicate images found on external sites'],
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80']
    },
    reporter: { name: 'Amit Shah', email: 'amit@example.com' },
    description: 'The owner requested an immediate deposit via Western Union before showing the property.',
    status: 'Pending',
    createdAt: generateDates(0)
  },
  {
    _id: '2',
    property: {
      _id: 'p2',
      title: 'Cozy Studio near DU North Campus',
      owner: { name: 'Sunita Sharma', email: 'sunita@example.com' },
      price: 8000,
      fraudScore: 45,
      riskLevel: 'medium',
      riskReasons: ['Suspicious keywords in description', 'New account with no history'],
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80']
    },
    reporter: { name: 'Priya Rai', email: 'priya@example.com' },
    description: 'Photos look like stock images from a US-based apartment listing.',
    status: 'Reviewed',
    createdAt: generateDates(1)
  },
  {
    _id: '3',
    property: {
      _id: 'p3',
      title: 'Beachfront Villa in Alibaug',
      owner: { name: 'Michael Dsouza', email: 'michael@example.com' },
      price: 120000,
      fraudScore: 12,
      riskLevel: 'low',
      riskReasons: [],
      images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=400&q=80']
    },
    reporter: { name: 'Suresh Kumar', email: 'suresh@example.com' },
    description: 'Just wanted to verify the ownership documents.',
    status: 'Dismissed',
    createdAt: generateDates(1)
  },
  {
    _id: '4',
    property: {
      _id: 'p4',
      title: 'Modern 3BHK in HSR Layout',
      owner: { name: 'Kiran Reddy', email: 'kiran@example.com' },
      price: 45000,
      fraudScore: 92,
      riskLevel: 'high',
      riskReasons: ['Identity verification failed', 'Multiple reports for the same phone number'],
      images: ['https://images.unsplash.com/photo-1502672260266-1c1de2d93688?auto=format&fit=crop&w=400&q=80']
    },
    reporter: { name: 'Vikram Singh', email: 'vikram@example.com' },
    description: 'The person claiming to be the owner is using a temporary VOIP number.',
    status: 'Pending',
    createdAt: generateDates(2)
  },
  {
    _id: '5',
    property: {
      _id: 'p5',
      title: 'Spacious Penthouse in Gurgaon',
      owner: { name: 'Anita Verma', email: 'anita@example.com' },
      price: 75000,
      fraudScore: 35,
      riskLevel: 'low',
      riskReasons: ['Frequent listing updates'],
      images: ['https://images.unsplash.com/photo-1600607687940-47a04b629571?auto=format&fit=crop&w=400&q=80']
    },
    reporter: { name: 'Rahul Roy', email: 'rahul@example.com' },
    description: 'The description changed three times in the last 24 hours.',
    status: 'Reviewed',
    createdAt: generateDates(3)
  },
  {
    _id: '6',
    property: {
      _id: 'p6',
      title: 'Semi-furnished 1BHK in Indiranagar',
      owner: { name: 'Pankaj Gupta', email: 'pankaj@example.com' },
      price: 25000,
      fraudScore: 78,
      riskLevel: 'high',
      riskReasons: ['Reported for "Overseas Owner" scam', 'Urgent deposit required'],
      images: ['https://images.unsplash.com/photo-1536376074432-8d63d592bfde?auto=format&fit=crop&w=400&q=80']
    },
    reporter: { name: 'Neha Gupta', email: 'neha@example.com' },
    description: 'Claims to be in London and wants me to pay "reservation fee" via GPay.',
    status: 'Pending',
    createdAt: generateDates(4)
  },
  {
    _id: '7',
    property: {
      _id: 'p7',
      title: 'Gated Community Villa in ECR',
      owner: { name: 'Vijay Mani', email: 'vijay@example.com' },
      price: 65000,
      fraudScore: 55,
      riskLevel: 'medium',
      riskReasons: ['Unusual contact hours', 'Email domain blacklisted'],
      images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=400&q=80']
    },
    reporter: { name: 'Arun Kumar', email: 'arun@example.com' },
    description: 'Email from owner came from a domain known for phishing.',
    status: 'Pending',
    createdAt: generateDates(5)
  },
  {
    _id: '8',
    property: {
      _id: 'p8',
      title: 'High-rise 3BHK in Whitefield',
      owner: { name: 'Sneha Latha', email: 'sneha@example.com' },
      price: 55000,
      fraudScore: 10,
      riskLevel: 'low',
      riskReasons: [],
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80']
    },
    reporter: { name: 'Deepak Rao', email: 'deepak@example.com' },
    description: 'Just checking if the society NOC is available.',
    status: 'Resolved',
    createdAt: generateDates(6)
  },
  {
    _id: '9',
    property: {
      _id: 'p9',
      title: 'Independent House in Anna Nagar',
      owner: { name: 'Siva Kumar', email: 'siva@example.com' },
      price: 40000,
      fraudScore: 82,
      riskLevel: 'high',
      riskReasons: ['Price is way too low for Anna Nagar', 'Same images used for a property in Kochi'],
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80']
    },
    reporter: { name: 'Meera Nair', email: 'meera@example.com' },
    description: 'Found this listing on another site with different owner name.',
    status: 'Pending',
    createdAt: generateDates(0)
  },
  {
    _id: '10',
    property: {
      _id: 'p10',
      title: 'Shared Accommodation in Pune',
      owner: { name: 'Tanmay Bhat', email: 'tanmay@example.com' },
      price: 12000,
      fraudScore: 40,
      riskLevel: 'medium',
      riskReasons: ['Suspiciously high price for shared room', 'Vague description'],
      images: []
    },
    reporter: { name: 'Aditya Birla', email: 'aditya@example.com' },
    description: 'Pricing seems exploitative for the area.',
    status: 'Reviewed',
    createdAt: generateDates(2)
  }
];

export const demoOverview = {
  totalReports: 10,
  highRiskCount: 4,
  resolvedCount: 3,
  totalProperties: 100
};

export const demoTrends = [
  { date: generateDates(6).split('T')[0], reports: 1 },
  { date: generateDates(5).split('T')[0], reports: 3 },
  { date: generateDates(4).split('T')[0], reports: 2 },
  { date: generateDates(3).split('T')[0], reports: 5 },
  { date: generateDates(2).split('T')[0], reports: 4 },
  { date: generateDates(1).split('T')[0], reports: 6 },
  { date: generateDates(0).split('T')[0], reports: 8 },
];
