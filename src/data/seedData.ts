// GreenQuest Seed Data - Demo accounts, curriculum, and quests

export interface DemoAccount {
  id: string;
  displayName: string;
  grade: number;
  type: 'student' | 'teacher';
  pin?: string;
  avatar: string;
  joinedDate: string;
}

export interface SkillLane {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  nodes: SkillNode[];
}

export interface SkillNode {
  id: string;
  title: string;
  description: string;
  laneId: string;
  order: number;
  isLocked: boolean;
  isCompleted: boolean;
  masteryScore: number;
  requiredScore: number;
  lesson: Lesson;
  quizzes: Quiz[];
  quest: Quest;
  xpReward: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  duration: number; // in minutes
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'photo' | 'geotag' | 'qr' | 'report' | 'team';
  difficulty: 'easy' | 'medium' | 'hard';
  basePoints: number;
  requirements: string[];
  timeLimit?: number; // in hours
  teamSize?: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  points: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  tokenCost: number;
  duration: number;
  modules: CourseModule[];
  certificate: string;
  badge?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive';
  duration: number;
}

// Demo Accounts
export const demoAccounts: DemoAccount[] = [
  {
    id: 'alice-001',
    displayName: 'Alice Johnson',
    grade: 6,
    type: 'student',
    avatar: '👧',
    joinedDate: '2024-01-15'
  },
  {
    id: 'ravi-002',
    displayName: 'Ravi Patel',
    grade: 8,
    type: 'student',
    avatar: '👦',
    joinedDate: '2024-01-20'
  },
  {
    id: 'neha-003',
    displayName: 'Neha Singh',
    grade: 10,
    type: 'student',
    avatar: '👩',
    joinedDate: '2024-01-18'
  },
  {
    id: 'teacher-001',
    displayName: 'Ms. Sharma',
    grade: 0,
    type: 'teacher',
    pin: '1234',
    avatar: '👩‍🏫',
    joinedDate: '2023-08-01'
  }
];

// Skill Lanes & Curriculum
export const skillLanes: SkillLane[] = [
  {
    id: 'waste-lane',
    title: 'Waste Management',
    description: 'Learn to reduce, reuse, and recycle effectively',
    color: 'quest-easy',
    icon: '♻️',
    nodes: []
  },
  {
    id: 'water-lane',
    title: 'Water Conservation',
    description: 'Discover ways to conserve and protect water resources',
    color: 'primary',
    icon: '💧',
    nodes: []
  },
  {
    id: 'tree-lane',
    title: 'Tree & Forest Care',
    description: 'Understand the importance of trees and forests',
    color: 'success',
    icon: '🌳',
    nodes: []
  },
  {
    id: 'energy-lane',
    title: 'Energy Efficiency',
    description: 'Learn about renewable energy and conservation',
    color: 'token-gold',
    icon: '⚡',
    nodes: []
  }
];

// Sample Skill Nodes (will be populated with full curriculum)
const createSkillNode = (
  id: string,
  title: string,
  description: string,
  laneId: string,
  order: number,
  lessonContent: string,
  quizData: Omit<Quiz, 'id'>[],
  questData: Omit<Quest, 'id'>
): SkillNode => ({
  id,
  title,
  description,
  laneId,
  order,
  isLocked: order > 1,
  isCompleted: false,
  masteryScore: 0,
  requiredScore: 80,
  lesson: {
    id: `lesson-${id}`,
    title: `${title} - Basics`,
    content: lessonContent,
    duration: 5
  },
  quizzes: quizData.map((quiz, index) => ({
    ...quiz,
    id: `quiz-${id}-${index + 1}`
  })),
  quest: {
    ...questData,
    id: `quest-${id}`
  },
  xpReward: questData.basePoints * 2
});

// Waste Management Lane
const wasteNodes: SkillNode[] = [
  createSkillNode(
    'waste-basics',
    'Waste Sorting Basics',
    'Learn the fundamentals of proper waste segregation',
    'waste-lane',
    1,
    `
    **What is Waste Segregation?**
    
    Waste segregation is the process of separating different types of waste materials at the source. This makes recycling more efficient and helps protect the environment.
    
    **Types of Waste:**
    - **Biodegradable**: Food scraps, leaves, paper
    - **Non-biodegradable**: Plastics, metals, glass
    - **Hazardous**: Batteries, chemicals, electronics
    
    **Why is it Important?**
    - Reduces pollution
    - Enables recycling
    - Protects wildlife
    - Conserves resources
    `,
    [
      {
        question: 'Which of these items is biodegradable?',
        options: ['Plastic bottle', 'Banana peel', 'Glass jar', 'Metal can'],
        correctAnswer: 1,
        explanation: 'Banana peels are organic matter that naturally decomposes.',
        points: 10
      },
      {
        question: 'What should you do with electronic waste?',
        options: ['Throw in regular bin', 'Take to e-waste center', 'Bury in garden', 'Burn it'],
        correctAnswer: 1,
        explanation: 'Electronic waste contains harmful materials and should be properly recycled.',
        points: 10
      }
    ],
    {
      title: 'Waste Audit Challenge',
      description: 'Take photos of different waste types in your home and categorize them correctly',
      type: 'photo',
      difficulty: 'easy',
      basePoints: 50,
      requirements: ['Take 5 photos of different waste items', 'Label each category', 'Submit with location']
    }
  ),
  createSkillNode(
    'waste-reduction',
    'Reduce & Reuse',
    'Master the art of minimizing waste through smart choices',
    'waste-lane',
    2,
    `
    **The 5 R's of Waste Management:**
    
    1. **Refuse** - Say no to unnecessary items
    2. **Reduce** - Use less of what you need
    3. **Reuse** - Find new purposes for items
    4. **Recycle** - Process materials into new products
    5. **Rot** - Compost organic waste
    
    **Creative Reuse Ideas:**
    - Glass jars as storage containers
    - Old t-shirts as cleaning rags
    - Cardboard boxes as organizers
    - Plastic containers as planters
    `,
    [
      {
        question: 'What is the best way to reduce plastic waste?',
        options: ['Use reusable bags', 'Buy more plastic', 'Throw away quickly', 'Ignore the problem'],
        correctAnswer: 0,
        explanation: 'Reusable bags eliminate the need for single-use plastic bags.',
        points: 15
      },
      {
        question: 'Which R comes first in waste hierarchy?',
        options: ['Recycle', 'Reduce', 'Reuse', 'Refuse'],
        correctAnswer: 3,
        explanation: 'Refusing unnecessary items prevents waste at the source.',
        points: 15
      }
    ],
    {
      title: 'DIY Upcycle Project',
      description: 'Create something useful from waste materials and document the process',
      type: 'photo',
      difficulty: 'medium',
      basePoints: 75,
      requirements: ['Use at least 3 waste items', 'Document before/after', 'Explain the process']
    }
  ),
  createSkillNode(
    'waste-community',
    'Community Impact',
    'Organize waste management initiatives in your community',
    'waste-lane',
    3,
    `
    **Building a Waste-Conscious Community**
    
    Individual actions create collective impact. Learn how to inspire others and organize community-wide waste reduction efforts.
    
    **Community Strategies:**
    - Organize neighborhood clean-up drives
    - Start composting programs
    - Create waste exchange systems
    - Educate through workshops
    
    **Measuring Impact:**
    - Track waste reduction percentages
    - Monitor recycling rates
    - Document behavior changes
    - Celebrate success stories
    `,
    [
      {
        question: 'What is the best way to engage neighbors in waste reduction?',
        options: ['Force them to participate', 'Lead by example', 'Ignore their habits', 'Complain loudly'],
        correctAnswer: 1,
        explanation: 'Leading by example inspires others to adopt sustainable practices.',
        points: 20
      },
      {
        question: 'How can you measure community waste reduction success?',
        options: ['Count complaints', 'Track recycling rates', 'Ignore data', 'Guess randomly'],
        correctAnswer: 1,
        explanation: 'Tracking measurable data helps assess program effectiveness.',
        points: 20
      }
    ],
    {
      title: 'Community Clean-Up Event',
      description: 'Organize and document a community waste management initiative',
      type: 'team',
      difficulty: 'hard',
      basePoints: 100,
      requirements: ['Involve at least 5 people', 'Document the event', 'Measure impact'],
      teamSize: 3
    }
  )
];

// Water Conservation Lane
const waterNodes: SkillNode[] = [
  createSkillNode(
    'water-cycle',
    'Understanding Water',
    'Learn about the water cycle and its importance',
    'water-lane',
    1,
    `
    **The Water Cycle: Nature's Recycling System**
    
    Water constantly moves through our environment in a process called the water cycle.
    
    **Key Processes:**
    - **Evaporation**: Sun heats water, turning it to vapor
    - **Condensation**: Water vapor forms clouds
    - **Precipitation**: Rain, snow, or hail falls
    - **Collection**: Water flows back to oceans and rivers
    
    **Why Water is Precious:**
    - Only 3% of Earth's water is fresh
    - Less than 1% is accessible for human use
    - Many communities lack clean water access
    `,
    [
      {
        question: 'What percentage of Earth\'s water is fresh water?',
        options: ['50%', '25%', '10%', '3%'],
        correctAnswer: 3,
        explanation: 'Only about 3% of Earth\'s water is fresh water, making it precious.',
        points: 10
      },
      {
        question: 'What drives the water cycle?',
        options: ['Wind', 'Sun', 'Moon', 'Gravity'],
        correctAnswer: 1,
        explanation: 'The sun provides energy that drives evaporation and the water cycle.',
        points: 10
      }
    ],
    {
      title: 'Water Source Mapping',
      description: 'Identify and photograph water sources in your area',
      type: 'geotag',
      difficulty: 'easy',
      basePoints: 50,
      requirements: ['Find 3 water sources', 'Take geo-tagged photos', 'Note water quality']
    }
  ),
  createSkillNode(
    'water-conservation',
    'Conservation Techniques',
    'Practical methods to save water at home and school',
    'water-lane',
    2,
    `
    **Smart Water Conservation at Home**
    
    Small changes in daily habits can lead to significant water savings.
    
    **Indoor Conservation:**
    - Fix leaky faucets and pipes
    - Take shorter showers (5 minutes max)
    - Turn off tap while brushing teeth
    - Use full loads in washing machines
    - Install low-flow fixtures
    
    **Outdoor Conservation:**
    - Water plants early morning or evening
    - Use drip irrigation systems
    - Collect rainwater for gardening
    - Choose drought-resistant plants
    `,
    [
      {
        question: 'How much water can a leaky faucet waste per day?',
        options: ['1 liter', '10 liters', '50 liters', '100+ liters'],
        correctAnswer: 3,
        explanation: 'A single dripping faucet can waste over 100 liters per day.',
        points: 15
      },
      {
        question: 'When is the best time to water plants?',
        options: ['Noon', 'Afternoon', 'Early morning', 'Anytime'],
        correctAnswer: 2,
        explanation: 'Early morning watering reduces evaporation and helps plants absorb water.',
        points: 15
      }
    ],
    {
      title: 'Home Water Audit',
      description: 'Conduct a comprehensive water usage audit of your home',
      type: 'report',
      difficulty: 'medium',
      basePoints: 75,
      requirements: ['Check all faucets and pipes', 'Measure daily usage', 'Create improvement plan']
    }
  ),
  createSkillNode(
    'water-quality',
    'Water Quality & Treatment',
    'Understanding and improving water quality',
    'water-lane',
    3,
    `
    **Water Quality Matters**
    
    Clean water is essential for health, but many factors can affect water quality.
    
    **Common Pollutants:**
    - Chemical runoff from agriculture
    - Industrial waste discharge
    - Plastic and microplastics
    - Bacterial contamination
    
    **Natural Treatment Methods:**
    - Constructed wetlands filter pollutants
    - Plants absorb excess nutrients
    - Beneficial bacteria break down waste
    - Sand and gravel provide physical filtration
    
    **Testing Water Quality:**
    - pH levels (acidity/alkalinity)
    - Dissolved oxygen content
    - Presence of harmful bacteria
    - Chemical pollutant levels
    `,
    [
      {
        question: 'What is a natural way to filter water pollutants?',
        options: ['Add more chemicals', 'Use constructed wetlands', 'Ignore the problem', 'Boil everything'],
        correctAnswer: 1,
        explanation: 'Constructed wetlands use plants and natural processes to filter pollutants.',
        points: 20
      },
      {
        question: 'Why is dissolved oxygen important in water?',
        options: ['Makes water taste better', 'Needed for aquatic life', 'Prevents freezing', 'Adds color'],
        correctAnswer: 1,
        explanation: 'Dissolved oxygen is essential for fish and other aquatic organisms to survive.',
        points: 20
      }
    ],
    {
      title: 'Water Quality Testing',
      description: 'Test and document water quality from different sources',
      type: 'photo',
      difficulty: 'hard',
      basePoints: 100,
      requirements: ['Test 3 different water sources', 'Document test results', 'Compare quality levels']
    }
  )
];

// Tree & Forest Care Lane
const treeNodes: SkillNode[] = [
  createSkillNode(
    'tree-importance',
    'Why Trees Matter',
    'Discover the vital role trees play in our ecosystem',
    'tree-lane',
    1,
    `
    **Trees: Earth's Natural Heroes**
    
    Trees are among the most important living organisms on our planet, providing countless benefits to humans and wildlife.
    
    **Environmental Benefits:**
    - Absorb CO2 and produce oxygen
    - Filter air pollutants
    - Prevent soil erosion
    - Regulate water cycles
    - Provide wildlife habitat
    
    **Social & Economic Benefits:**
    - Reduce energy costs (natural cooling)
    - Increase property values
    - Provide food, medicine, and materials
    - Create jobs in forestry and tourism
    - Improve mental health and well-being
    
    **Amazing Tree Facts:**
    - A large tree can produce oxygen for 4 people per day
    - Trees can live for hundreds or thousands of years
    - Forest cover affects local weather patterns
    `,
    [
      {
        question: 'How many people can a large tree provide oxygen for daily?',
        options: ['1 person', '2 people', '4 people', '10 people'],
        correctAnswer: 2,
        explanation: 'A large tree produces enough oxygen to support about 4 people per day.',
        points: 10
      },
      {
        question: 'What is one way trees help prevent climate change?',
        options: ['Reflect sunlight', 'Absorb CO2', 'Create wind', 'Block rain'],
        correctAnswer: 1,
        explanation: 'Trees absorb carbon dioxide, a major greenhouse gas, helping fight climate change.',
        points: 10
      }
    ],
    {
      title: 'Tree Species Survey',
      description: 'Identify and photograph different tree species in your area',
      type: 'photo',
      difficulty: 'easy',
      basePoints: 50,
      requirements: ['Identify 5 different tree species', 'Take clear photos of leaves/bark', 'Note location data']
    }
  ),
  createSkillNode(
    'tree-care',
    'Tree Planting & Care',
    'Learn proper techniques for planting and maintaining trees',
    'tree-lane',
    2,
    `
    **From Seed to Forest: Growing Trees Right**
    
    Proper tree care ensures healthy growth and maximum environmental benefit.
    
    **Planting Guidelines:**
    - Choose native species for your region
    - Plant during optimal seasons (spring/fall)
    - Dig holes 2-3 times wider than root ball
    - Water regularly but don't overwater
    - Mulch around base to retain moisture
    
    **Ongoing Care:**
    - Prune dead or damaged branches
    - Monitor for pests and diseases
    - Protect from lawn mower damage
    - Provide support stakes for young trees
    - Fertilize appropriately based on soil tests
    
    **Common Mistakes to Avoid:**
    - Planting too deep or too shallow
    - Over-fertilizing or over-watering
    - Ignoring root space requirements
    - Choosing wrong species for climate
    `,
    [
      {
        question: 'When is the best time to plant trees?',
        options: ['Summer', 'Winter', 'Spring or Fall', 'Anytime'],
        correctAnswer: 2,
        explanation: 'Spring and fall provide optimal conditions for tree establishment.',
        points: 15
      },
      {
        question: 'Why should you choose native tree species?',
        options: ['They look better', 'They grow faster', 'They adapt better to local conditions', 'They cost less'],
        correctAnswer: 2,
        explanation: 'Native species are adapted to local climate and soil, requiring less maintenance.',
        points: 15
      }
    ],
    {
      title: 'Tree Planting Project',
      description: 'Plant and document the growth of a tree or create a mini forest',
      type: 'photo',
      difficulty: 'medium',
      basePoints: 75,
      requirements: ['Plant at least 1 tree', 'Document planting process', 'Create care plan']
    }
  ),
  createSkillNode(
    'forest-conservation',
    'Forest Conservation',
    'Understand forest ecosystems and conservation efforts',
    'tree-lane',
    3,
    `
    **Protecting Our Forest Heritage**
    
    Forests are complex ecosystems that support incredible biodiversity and provide essential services.
    
    **Forest Ecosystem Services:**
    - Carbon storage and climate regulation
    - Watershed protection and water purification
    - Biodiversity conservation
    - Soil formation and protection
    - Recreation and cultural values
    
    **Threats to Forests:**
    - Deforestation for agriculture and development
    - Climate change effects
    - Invasive species introduction
    - Pollution and acid rain
    - Unsustainable logging practices
    
    **Conservation Strategies:**
    - Protected area establishment
    - Sustainable forest management
    - Reforestation and afforestation
    - Community-based conservation
    - International cooperation agreements
    
    **How You Can Help:**
    - Support forest-friendly products
    - Participate in tree-planting events
    - Educate others about forest importance
    - Reduce paper consumption
    - Choose sustainable wood products
    `,
    [
      {
        question: 'What is the main cause of deforestation?',
        options: ['Natural disasters', 'Agriculture expansion', 'Tree diseases', 'Animal damage'],
        correctAnswer: 1,
        explanation: 'Agriculture expansion is the leading cause of deforestation worldwide.',
        points: 20
      },
      {
        question: 'What is sustainable forest management?',
        options: ['Cutting all trees', 'Never cutting trees', 'Balanced harvesting and regrowth', 'Only planting new trees'],
        correctAnswer: 2,
        explanation: 'Sustainable management balances harvesting with natural regeneration and conservation.',
        points: 20
      }
    ],
    {
      title: 'Forest Conservation Campaign',
      description: 'Create and implement a forest awareness campaign in your community',
      type: 'team',
      difficulty: 'hard',
      basePoints: 100,
      requirements: ['Develop educational materials', 'Engage at least 10 people', 'Measure campaign impact'],
      teamSize: 4
    }
  )
];

// Energy Efficiency Lane
const energyNodes: SkillNode[] = [
  createSkillNode(
    'energy-basics',
    'Energy Fundamentals',
    'Understanding different types of energy and their sources',
    'energy-lane',
    1,
    `
    **Energy: The Power Behind Everything**
    
    Energy is the ability to do work and is essential for all life processes and human activities.
    
    **Types of Energy:**
    - **Kinetic**: Energy of motion (wind, moving water)
    - **Potential**: Stored energy (batteries, elevated water)
    - **Thermal**: Heat energy from molecular motion
    - **Chemical**: Energy stored in molecular bonds
    - **Solar**: Energy from electromagnetic radiation
    
    **Energy Sources:**
    - **Renewable**: Solar, wind, hydro, geothermal, biomass
    - **Non-renewable**: Coal, oil, natural gas, nuclear
    
    **Energy Conversion:**
    Energy constantly changes from one form to another:
    - Solar panels convert sunlight to electricity
    - Wind turbines convert motion to electricity
    - Batteries convert chemical energy to electrical
    - Our bodies convert food to kinetic energy
    `,
    [
      {
        question: 'Which is an example of renewable energy?',
        options: ['Coal', 'Solar power', 'Natural gas', 'Nuclear'],
        correctAnswer: 1,
        explanation: 'Solar power is renewable because the sun continuously provides energy.',
        points: 10
      },
      {
        question: 'What type of energy do batteries store?',
        options: ['Kinetic', 'Chemical', 'Thermal', 'Solar'],
        correctAnswer: 1,
        explanation: 'Batteries store energy in chemical form and convert it to electrical energy.',
        points: 10
      }
    ],
    {
      title: 'Energy Source Investigation',
      description: 'Identify and document different energy sources in your area',
      type: 'photo',
      difficulty: 'easy',
      basePoints: 50,
      requirements: ['Find 3 different energy sources', 'Classify as renewable/non-renewable', 'Explain how each works']
    }
  ),
  createSkillNode(
    'energy-efficiency',
    'Energy Conservation',
    'Practical ways to reduce energy consumption at home and school',
    'energy-lane',
    2,
    `
    **Smart Energy Use: Less Waste, More Savings**
    
    Energy efficiency means using less energy to provide the same level of comfort and service.
    
    **Home Energy Efficiency:**
    - Switch to LED light bulbs (90% less energy)
    - Unplug devices when not in use (phantom loads)
    - Use programmable thermostats
    - Improve insulation and seal air leaks
    - Choose ENERGY STAR appliances
    
    **Behavioral Changes:**
    - Turn off lights when leaving rooms
    - Use natural light when possible
    - Air dry clothes instead of using dryer
    - Take shorter hot showers
    - Use fans instead of AC when possible
    
    **School Energy Actions:**
    - Start energy patrol teams
    - Monitor classroom energy use
    - Educate peers about conservation
    - Organize energy-saving competitions
    - Advocate for efficient school equipment
    
    **Benefits of Energy Efficiency:**
    - Reduces utility bills
    - Decreases pollution
    - Extends appliance life
    - Improves comfort levels
    `,
    [
      {
        question: 'How much energy do LED bulbs save compared to incandescent?',
        options: ['25%', '50%', '75%', '90%'],
        correctAnswer: 3,
        explanation: 'LED bulbs use about 90% less energy than traditional incandescent bulbs.',
        points: 15
      },
      {
        question: 'What are phantom loads?',
        options: ['Ghost electricity', 'Energy used by plugged-in devices', 'Broken appliances', 'Solar energy'],
        correctAnswer: 1,
        explanation: 'Phantom loads are energy consumed by devices that are plugged in but not actively being used.',
        points: 15
      }
    ],
    {
      title: 'Home Energy Audit',
      description: 'Conduct a detailed energy audit and create an efficiency improvement plan',
      type: 'report',
      difficulty: 'medium',
      basePoints: 75,
      requirements: ['Assess all energy uses', 'Identify improvement opportunities', 'Calculate potential savings']
    }
  ),
  createSkillNode(
    'renewable-energy',
    'Renewable Energy Systems',
    'Explore renewable energy technologies and their implementation',
    'energy-lane',
    3,
    `
    **Harnessing Nature's Power: Renewable Energy Revolution**
    
    Renewable energy sources provide clean, sustainable power that doesn't deplete natural resources.
    
    **Solar Energy:**
    - Photovoltaic panels convert sunlight to electricity
    - Solar thermal systems heat water directly
    - Can be installed on rooftops or in solar farms
    - Works even on cloudy days (reduced efficiency)
    
    **Wind Energy:**
    - Wind turbines convert air movement to electricity
    - Can be onshore or offshore installations
    - Most effective in areas with consistent winds
    - Small turbines available for homes/schools
    
    **Hydroelectric Power:**
    - Uses flowing or falling water to generate electricity
    - Can range from large dams to micro-hydro systems
    - Very reliable and long-lasting
    - Minimal ongoing fuel costs
    
    **Other Renewable Sources:**
    - **Geothermal**: Uses Earth's internal heat
    - **Biomass**: Burns organic materials sustainably
    - **Tidal**: Harnesses ocean tide movements
    
    **Benefits of Renewables:**
    - Zero fuel costs after installation
    - Minimal environmental impact
    - Creates local jobs
    - Reduces dependence on imports
    - Helps fight climate change
    `,
    [
      {
        question: 'Which renewable energy source works 24/7 in most locations?',
        options: ['Solar', 'Wind', 'Geothermal', 'Tidal'],
        correctAnswer: 2,
        explanation: 'Geothermal energy provides consistent power because Earth\'s internal heat is constant.',
        points: 20
      },
      {
        question: 'What is the main advantage of renewable energy over fossil fuels?',
        options: ['Cheaper installation', 'No ongoing fuel costs', 'Easier to build', 'Works everywhere'],
        correctAnswer: 1,
        explanation: 'Renewable energy has no ongoing fuel costs once installed, unlike fossil fuels.',
        points: 20
      }
    ],
    {
      title: 'Renewable Energy Design Project',
      description: 'Design and present a renewable energy system for your school or community',
      type: 'report',
      difficulty: 'hard',
      basePoints: 100,
      requirements: ['Choose appropriate technology', 'Calculate energy needs', 'Create detailed proposal']
    }
  )
];

// Populate skill lanes with nodes
skillLanes[0].nodes = wasteNodes;
skillLanes[1].nodes = waterNodes;
skillLanes[2].nodes = treeNodes;
skillLanes[3].nodes = energyNodes;

// Badges
export const badges: Badge[] = [
  {
    id: 'first-quest',
    title: 'Quest Explorer',
    description: 'Complete your first quest',
    icon: '🗺️',
    color: 'badge-bronze',
    requirement: 'Complete 1 quest',
    points: 25
  },
  {
    id: 'waste-warrior',
    title: 'Waste Warrior',
    description: 'Master waste management fundamentals',
    icon: '♻️',
    color: 'badge-silver',
    requirement: 'Complete waste management lane',
    points: 100
  },
  {
    id: 'water-guardian',
    title: 'Water Guardian',
    description: 'Become a water conservation expert',
    icon: '💧',
    color: 'badge-silver',
    requirement: 'Complete water conservation lane',
    points: 100
  },
  {
    id: 'tree-champion',
    title: 'Tree Champion',
    description: 'Master tree and forest conservation',
    icon: '🌳',
    color: 'badge-silver',
    requirement: 'Complete tree care lane',
    points: 100
  },
  {
    id: 'energy-expert',
    title: 'Energy Expert',
    description: 'Become an energy efficiency specialist',
    icon: '⚡',
    color: 'badge-silver',
    requirement: 'Complete energy lane',
    points: 100
  },
  {
    id: 'eco-master',
    title: 'Eco Master',
    description: 'Complete all skill lanes',
    icon: '🏆',
    color: 'badge-gold',
    requirement: 'Complete all 4 skill lanes',
    points: 500
  },
  {
    id: 'streak-keeper',
    title: 'Streak Keeper',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    color: 'badge-bronze',
    requirement: '7-day streak',
    points: 50
  },
  {
    id: 'team-player',
    title: 'Team Player',
    description: 'Complete a team quest successfully',
    icon: '🤝',
    color: 'badge-bronze',
    requirement: 'Complete 1 team quest',
    points: 75
  }
];

// Marketplace Courses
export const marketplaceCourses: Course[] = [
  {
    id: 'advanced-composting',
    title: 'Advanced Composting Techniques',
    description: 'Master the science of turning organic waste into valuable compost',
    tokenCost: 150,
    duration: 45,
    certificate: 'Composting Specialist',
    badge: 'compost-master',
    modules: [
      {
        id: 'compost-science',
        title: 'The Science of Decomposition',
        content: 'Learn about the microorganisms and processes that break down organic matter...',
        type: 'text',
        duration: 15
      },
      {
        id: 'compost-methods',
        title: 'Different Composting Methods',
        content: 'Explore various composting techniques including hot composting, vermicomposting, and bokashi...',
        type: 'interactive',
        duration: 20
      },
      {
        id: 'troubleshooting',
        title: 'Troubleshooting Common Problems',
        content: 'Identify and solve common composting issues like odors, pests, and slow decomposition...',
        type: 'text',
        duration: 10
      }
    ]
  },
  {
    id: 'renewable-energy-systems',
    title: 'DIY Renewable Energy Systems',
    description: 'Build small-scale solar and wind energy systems',
    tokenCost: 200,
    duration: 60,
    certificate: 'Renewable Energy Builder',
    modules: [
      {
        id: 'solar-basics',
        title: 'Solar Panel Fundamentals',
        content: 'Understanding photovoltaic cells, inverters, and battery storage systems...',
        type: 'text',
        duration: 20
      },
      {
        id: 'wind-power',
        title: 'Small Wind Turbines',
        content: 'Design and build micro wind turbines for home energy generation...',
        type: 'interactive',
        duration: 25
      },
      {
        id: 'system-integration',
        title: 'Integrating Renewable Systems',
        content: 'Combining solar and wind with grid-tie and off-grid applications...',
        type: 'text',
        duration: 15
      }
    ]
  },
  {
    id: 'permaculture-garden',
    title: 'Permaculture Garden Design',
    description: 'Create sustainable food systems using permaculture principles',
    tokenCost: 175,
    duration: 50,
    certificate: 'Permaculture Designer',
    modules: [
      {
        id: 'permaculture-principles',
        title: 'Core Permaculture Principles',
        content: 'Earth care, people care, and fair share - the foundation of permaculture design...',
        type: 'text',
        duration: 15
      },
      {
        id: 'zone-planning',
        title: 'Zone and Sector Planning',
        content: 'Organizing your space for maximum efficiency and minimal input...',
        type: 'interactive',
        duration: 20
      },
      {
        id: 'plant-selection',
        title: 'Choosing the Right Plants',
        content: 'Selecting plants that work together in beneficial relationships...',
        type: 'text',
        duration: 15
      }
    ]
  }
];

// Token calculation constants
export const tokenCalculatorConfig = {
  baseDifficulty: {
    easy: 50,
    medium: 75,
    hard: 100
  },
  evidenceModifiers: {
    photo: 1.0,
    geotag: 1.2,
    qr: 1.1,
    report: 1.3,
    team: 1.5
  },
  validatorQuality: {
    min: 0.5,
    max: 1.5,
    default: 1.0
  },
  timeliness: {
    immediate: 1.2, // within 1 hour
    same_day: 1.1,  // within 24 hours
    week: 1.0,      // within 7 days
    late: 0.8       // after 7 days
  },
  streak: {
    multiplier: 0.1, // +10% per streak day
    maxMultiplier: 2.0 // cap at 200%
  },
  teamBonus: {
    solo: 1.0,
    pair: 1.1,
    small: 1.2, // 3-5 people
    large: 1.3  // 6+ people
  }
};