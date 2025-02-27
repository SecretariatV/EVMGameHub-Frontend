export enum EPaymentEvents {
  login = "7234cd9d55",
  withdraw = "6f6363325c",
  deposit = "13474ade7",
  setAdminWallet = "9a2d27683581f",
  paymentFailed = "payment-failed",
  updateBalance = "updateBalance",
}

export type TSocketDepositParam = {
  amount: number;
  currency: string;
  address: string;
  txHash: string;
};

export type TUpdateBalanceParam = {
  walletValue: number;
  token: string;
};

export type TSocketWithDrawParam = {
  amount: number;
  currency: string;
  address: string;
};

export type TAdminWallet = {
  address1: string;
  address2: string;
};

export interface IPaymentClientToServerEvents {
  [EPaymentEvents.login]: (token: string) => void;
  [EPaymentEvents.withdraw]: (data: TSocketWithDrawParam) => void;
  [EPaymentEvents.deposit]: (data: TSocketDepositParam) => void;
}

export interface IPaymentServerToClientEvents {
  [EPaymentEvents.setAdminWallet]: (data: TAdminWallet) => void;
  [EPaymentEvents.updateBalance]: (data: TUpdateBalanceParam) => void;
}
