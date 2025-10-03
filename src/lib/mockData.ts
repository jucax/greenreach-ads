import type { CampaignPlan } from './claude';

// Mock campaign data generator
export function generateMockCampaignPlan(data: {
  productName: string;
  productDescription: string;
  productCategory: string;
  budget: number;
  objective: string;
  startDate: string;
  endDate: string;
}): CampaignPlan {
  console.log('🎭 Generating mock campaign plan...');
  console.log('📊 Campaign data:', data);

  // Calculate platform budget allocation based on total budget
  const totalBudget = data.budget;
  const instagramBudget = Math.round(totalBudget * 0.4);
  const facebookBudget = Math.round(totalBudget * 0.35);
  const googleBudget = totalBudget - instagramBudget - facebookBudget;

  // Generate mock data based on product category
  const getCategoryData = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology':
      case 'software':
        return {
          ageRange: '25-45',
          interests: ['Technology', 'Innovation', 'Productivity', 'Business'],
          demographics: 'Tech-savvy professionals and entrepreneurs',
          incomeLevel: '$60K-$150K',
          primary: 'San Francisco Bay Area',
          cities: ['San Francisco', 'Austin', 'Seattle', 'New York'],
          bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
          bestTimes: ['9am-11am PST', '2pm-4pm PST'],
          reasoning: 'Tech professionals are most active during work hours and mid-week'
        };
      case 'fashion':
      case 'clothing':
        return {
          ageRange: '18-35',
          interests: ['Fashion', 'Style', 'Shopping', 'Lifestyle'],
          demographics: 'Style-conscious millennials and Gen Z',
          incomeLevel: '$30K-$80K',
          primary: 'Los Angeles',
          cities: ['Los Angeles', 'New York', 'Miami', 'Chicago'],
          bestDays: ['Friday', 'Saturday', 'Sunday'],
          bestTimes: ['7pm-9pm EST', '12pm-2pm EST'],
          reasoning: 'Fashion shopping peaks on weekends and evenings'
        };
      case 'health':
      case 'fitness':
        return {
          ageRange: '22-45',
          interests: ['Health', 'Fitness', 'Wellness', 'Nutrition'],
          demographics: 'Health-conscious individuals seeking improvement',
          incomeLevel: '$40K-$100K',
          primary: 'Denver',
          cities: ['Denver', 'Portland', 'San Diego', 'Boston'],
          bestDays: ['Monday', 'Wednesday', 'Friday'],
          bestTimes: ['6am-8am EST', '5pm-7pm EST'],
          reasoning: 'Health enthusiasts are most motivated at start of week and after work'
        };
      case 'food':
      case 'restaurant':
        return {
          ageRange: '25-50',
          interests: ['Food', 'Cooking', 'Dining', 'Local Business'],
          demographics: 'Food enthusiasts and local community supporters',
          incomeLevel: '$35K-$90K',
          primary: 'Portland',
          cities: ['Portland', 'Austin', 'Nashville', 'Portland'],
          bestDays: ['Thursday', 'Friday', 'Saturday'],
          bestTimes: ['11am-1pm EST', '6pm-8pm EST'],
          reasoning: 'Food decisions peak during lunch and dinner hours'
        };
      default:
        return {
          ageRange: '25-45',
          interests: ['Business', 'Innovation', 'Quality', 'Value'],
          demographics: 'Conscious consumers seeking quality products',
          incomeLevel: '$40K-$100K',
          primary: 'Chicago',
          cities: ['Chicago', 'Atlanta', 'Phoenix', 'Dallas'],
          bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
          bestTimes: ['10am-12pm EST', '2pm-4pm EST'],
          reasoning: 'General business hours show highest engagement'
        };
    }
  };

  const categoryData = getCategoryData(data.productCategory);

  const mockPlan: CampaignPlan = {
    targetAudience: {
      ageRange: categoryData.ageRange,
      interests: categoryData.interests,
      demographics: categoryData.demographics,
      incomeLevel: categoryData.incomeLevel
    },
    geographic: {
      primary: categoryData.primary,
      cities: categoryData.cities
    },
    schedule: {
      bestDays: categoryData.bestDays,
      bestTimes: categoryData.bestTimes,
      reasoning: categoryData.reasoning
    },
    platforms: [
      {
        name: 'Instagram',
        budget: instagramBudget,
        percentage: Math.round((instagramBudget / totalBudget) * 100),
        reasoning: `Perfect for ${data.productCategory.toLowerCase()} products with visual appeal and younger demographics`
      },
      {
        name: 'Facebook',
        budget: facebookBudget,
        percentage: Math.round((facebookBudget / totalBudget) * 100),
        reasoning: `Strong reach for ${data.productCategory.toLowerCase()} with detailed targeting options`
      },
      {
        name: 'Google',
        budget: googleBudget,
        percentage: Math.round((googleBudget / totalBudget) * 100),
        reasoning: `Captures high-intent users actively searching for ${data.productCategory.toLowerCase()} solutions`
      }
    ],
    adVariations: [
      {
        name: `Premium ${data.productName} Experience`,
        targetSegment: 'High-income professionals',
        headline: `Transform Your ${data.productCategory} Experience`,
        body: `Discover ${data.productName} - the premium solution for ${data.productDescription.toLowerCase()}. Join thousands of satisfied customers who've upgraded their experience.`,
        cta: 'Get Started Today',
        whyItWorks: 'Appeals to quality-conscious consumers willing to pay for premium features'
      },
      {
        name: `Affordable ${data.productName} Solution`,
        targetSegment: 'Budget-conscious consumers',
        headline: `Smart ${data.productCategory} Made Simple`,
        body: `Get the most value with ${data.productName}. ${data.productDescription} without breaking the bank. Perfect for everyday use.`,
        cta: 'Try Now',
        whyItWorks: 'Focuses on value and accessibility for price-sensitive audiences'
      },
      {
        name: `Innovative ${data.productName} Approach`,
        targetSegment: 'Early adopters and tech enthusiasts',
        headline: `The Future of ${data.productCategory}`,
        body: `Experience next-generation ${data.productName}. ${data.productDescription} with cutting-edge technology that sets new standards.`,
        cta: 'Be First',
        whyItWorks: 'Targets innovation-seekers who want to be ahead of the curve'
      }
    ]
  };

  console.log('✅ Mock campaign plan generated successfully:', mockPlan);
  return mockPlan;
}

// Mock sustainability metrics calculator
export function calculateMockSustainabilityMetrics(budget: number) {
  const traditionalEnergy = budget * 0.076;
  const optimizedEnergy = traditionalEnergy * 0.4;
  const co2Saved = (traditionalEnergy - optimizedEnergy) * 0.5;
  
  let score = 'C';
  if (optimizedEnergy < traditionalEnergy * 0.35) score = 'A+';
  else if (optimizedEnergy < traditionalEnergy * 0.40) score = 'A';
  else if (optimizedEnergy < traditionalEnergy * 0.45) score = 'A-';
  else if (optimizedEnergy < traditionalEnergy * 0.50) score = 'B+';
  else if (optimizedEnergy < traditionalEnergy * 0.60) score = 'B';
  
  return {
    energy_used_kwh: Math.round(optimizedEnergy * 100) / 100,
    co2_avoided_kg: Math.round(co2Saved * 100) / 100,
    green_score: score
  };
}
