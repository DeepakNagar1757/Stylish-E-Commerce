// src/features/auth/data/onboardingData.ts

import ChooseProducts from "@/src/assets/svg/onBoarding/chooseProducts.svg";
import MakePayment from "@/src/assets/svg/onBoarding/makePayment.svg";
import GetOrder from "@/src/assets/svg/onBoarding/getOrder.svg";

export const onboardingData = [
  {
    id: 1,
    title: "Choose Products",
    description:
      "Amet minim mollit non deserunt ullamco est sit aliqua dolor do ll sint. Velit officia consequat duis enim velit mollit.",
    Image: ChooseProducts,
  },
  {
    id: 2,
    title: "Make Payment",
    description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
    Image: MakePayment,
  },
  {
    id: 3,
    title: "Get Your Order",
    description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
    Image: GetOrder,
  },
];