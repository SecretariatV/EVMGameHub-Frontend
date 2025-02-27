import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { readContract } from "wagmi/actions";
import {
  CACME_TOKEN_ABI,
  CACME_TOKEN_CONTRACT_ADDRESS,
  CWagmiConfig,
} from "@/utils/crypto";
import { formatUnits } from "ethers/lib/utils";

export default function useAcmeBalance() {
  const { address: accountAddress, chainId } = useAccount();
  const [acmeBalance, setAcmeBalance] = useState(0);
  const updateBalance = async () => {
    if (!accountAddress || !chainId) {
      setAcmeBalance(0);
      return;
    }
    const response = await readContract(CWagmiConfig, {
      abi: CACME_TOKEN_ABI,
      address: CACME_TOKEN_CONTRACT_ADDRESS,
      functionName: "balanceOf",
      args: [accountAddress],
      account: accountAddress,
    });
    const balance = Number(
      formatUnits((response as string).toString(), "ether")
    );
    setAcmeBalance(balance);
  };

  useEffect(() => {
    updateBalance();
  }, [accountAddress, chainId]);

  return {
    acmeBalance,
    updateBalance,
  };
}
