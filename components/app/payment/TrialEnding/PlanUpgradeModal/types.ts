
interface CommonBenefits {
  benefits: string[];
}

interface HomeDeliveryBenefits {
  benefits: string[];
  promotions: string[];
}

export interface Plan {
  id: number;
  name: string;
  planName: string;
  commonBenefits: CommonBenefits;
  homeDeliveryBenefits: HomeDeliveryBenefits;
  plusBenefits: null;
  monthlyStripeId: string;
  anualStripeId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  priceMonthly: number;
  priceAnnual: number;
}
