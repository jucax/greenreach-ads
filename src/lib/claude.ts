console.log('🤖 Mock Campaign Generator: Initializing...');
console.log('🎭 Using mock data instead of Claude API');

export interface CampaignPlan {
  targetAudience: {
    ageRange: string;
    interests: string[];
    demographics: string;
    incomeLevel: string;
  };
  geographic: {
    primary: string;
    cities: string[];
  };
  schedule: {
    bestDays: string[];
    bestTimes: string[];
    reasoning: string;
  };
  platforms: {
    name: string;
    budget: number;
    percentage: number;
    reasoning: string;
  }[];
  adVariations: {
    name: string;
    targetSegment: string;
    headline: string;
    body: string;
    cta: string;
    whyItWorks: string;
  }[];
}

export async function generateCampaignPlan(data: {
  productName: string;
  productDescription: string;
  productCategory: string;
  budget: number;
  objective: string;
  startDate: string;
  endDate: string;
}): Promise<CampaignPlan> {
  // Import mock data generator
  const { generateMockCampaignPlan } = await import('./mockData');
  
  // Use mock data instead of Claude API
  return generateMockCampaignPlan(data);
}
