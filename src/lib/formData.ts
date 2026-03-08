export const generateApplicationId = (): string => {
  const prefix = "BB";
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${year}-${random}`;
};

export const accountTypes = [
  {
    id: "savings",
    title: "Corporate Savings Account",
    personalTitle: "Savings Account",
    fee: "€25,000 Opening Fee",
    description: "Standard corporate savings. KTT transaction eligible.",
    personalDescription: "Standard savings account. KTT transaction eligible.",
  },
  {
    id: "custody",
    title: "Corporate Custody Account",
    personalTitle: "Custody Account",
    fee: "€25,000 Opening Fee",
    description: "Corporate asset safekeeping and custody. KTT eligible.",
    personalDescription: "Asset safekeeping and custody. KTT eligible.",
  },
  {
    id: "numbered",
    title: "Numbered Account",
    fee: "€50,000 Opening Fee",
    description: "Enhanced privacy numbered corporate account. KTT eligible.",
    personalDescription: "Enhanced privacy numbered account. KTT eligible.",
    personalTitle: "Numbered Account",
  },
  {
    id: "crypto",
    title: "Corporate Crypto Account",
    personalTitle: "Cryptocurrency Account",
    fee: "€25,000 Opening Fee",
    description: "Corporate digital asset management.",
    personalDescription: "Digital asset management.",
  },
];

export const paymentInstructions = {
  euro: {
    bankName: "Wise Europe",
    bankAddress: "Rue du Trône 100, 3rd floor. Brussels. 1050. Belgium",
    swiftCode: "TRWIBEB1XXX",
    accountName: "PROMINENCE CLIENT MANAGEMENT",
    accountNumber: "BE31905717979455",
    accountAddress: "Rue du Trône 100, 3rd floor. Brussels. 1050. Belgium",
  },
  usd: {
    bankName: "Wise US Inc.",
    bankAddress: "108 W 13th St, Wilmington, DE, 19801, United States",
    swiftCode: "TRWIUS35XXX",
    accountName: "PROMINENCE CLIENT MANAGEMENT",
    accountNumber: "205414015428310",
    accountAddress: "108 W 13th St, Wilmington, DE, 19801, United States",
  },
  crypto: {
    walletAddress: "TPYjSzK3BbZRZAVhBoRZcdyzKpQ9NN6S6Y",
    network: "USDT TRC20",
  },
};
