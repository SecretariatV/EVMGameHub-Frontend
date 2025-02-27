import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ModalType } from "@/types/modal";
import useModal from "@/hooks/use-modal";
import { z } from "zod";
import useToast from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosPost, setAccessToken } from "@/utils/axios";
import { BACKEND_API_ENDPOINT } from "@/utils/constant";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useDispatch } from "react-redux";
import { SiweMessage } from "siwe";
import { userActions } from "@/store/redux/actions";
import { useAppSelector } from "@/store/redux";
import { useEffect, useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import { useAccount, useChainId, useDisconnect, useSignMessage } from "wagmi";
import LoadingIcon from "../loading-icon";

const SignInSchema = z.object({
  username: z.string().nonempty("Full Name is required"),
  wallet: z.string().nonempty("Wallet is required"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const SignInDefaultValue = {
  username: "",
  password: "",
  wallet: "",
};

const SignInModal = () => {
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const modal = useModal();
  const modalState = useAppSelector((state: any) => state.modal);
  const userState = useAppSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const { address: walletAddress } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const isOpen = modalState.open && modalState.type === ModalType.LOGIN;
  const signInForm = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: SignInDefaultValue,
  });

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.LOGIN);
    }
  };

  const handleOpenSignUp = async () => {
    modal.open(ModalType.SIGNUP);
  };

  const handleConnectWallet = async () => {
    try {
      if (walletAddress) {
        signInForm.setValue("wallet", "");
        await disconnect();
        return;
      } else {
        modal.open(ModalType.WALLETCONNECT, ModalType.LOGIN);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (data: z.infer<typeof SignInSchema>) => {
    setLoading(true);
    const signedSig =await signPixelWithWallet();
    if (!signedSig) {
      toast.error("Please sign in with wallet");
      setLoading(false);
      return;
    }
    try {
      const signInPayload = {
        username: data.username,
        password: data.password,
        signAddress: data.wallet,
        signedSig,
      };
      const resSignIn = await axiosPost([
        BACKEND_API_ENDPOINT.auth.signIn,
        { data: signInPayload },
      ]);

      if (rememberMe) {
        dispatch(
          userActions.setCredential({
            username: signInForm.getValues("username"),
            password: signInForm.getValues("password"),
          })
        );
      } else {
        dispatch(userActions.removeCredential());
      }

      if (resSignIn?.auth?.accessToken) {
        setAccessToken(resSignIn?.auth?.accessToken);
        await dispatch(
          userActions.userData({ ...resSignIn?.user, password: data.password })
        );
        toast.success("SignIn Success");
        modal.close(ModalType.LOGIN);
        return;
      }
    } catch (error: any) {
      toast.error(error?.error);
    } finally {
      setLoading(false);
    }
  };

  const signPixelWithWallet = async () => {
    try {
      const currentDate = new Date();
      currentDate.setMilliseconds(0);
      currentDate.setSeconds(0);
      currentDate.setMinutes(0);
      const issuedAt = currentDate.toISOString();
      if (walletAddress && isOpen) {
        const message = new SiweMessage({
          domain: window.location.host,
          address: walletAddress,
          statement: "Sign in to ACME Bet",
          uri: window.location.origin,
          version: "1",
          chainId,
          nonce: walletAddress,
          issuedAt,
        });
        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });
        return signature;
      }
      return "";
    } catch (error) {
      console.error(error);
      toast.error("Please sign wallet");
    }
  };

  useEffect(() => {
    const { username, password } = userState.remember
      ? userState.credentials
      : { username: "", password: "" };
    signInForm.setValue("username", username);
    signInForm.setValue("password", password);
    setLoading(false);
  }, []);


  useEffect(() => {
    if (walletAddress) {
      signInForm.setValue("wallet", walletAddress);
    } else {
      disconnect();
      signInForm.setValue("wallet", "");
    }
  }, [walletAddress]);

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="font-secondary! rounded-lg border-2 border-x-primary bg-primary p-10 text-black sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center font-primary text-3xl">
            LOGIN
          </DialogTitle>
        </DialogHeader>
        <Form {...signInForm}>
          <form onSubmit={signInForm.handleSubmit(handleSubmit)}>
            <div className="mt-3 flex flex-col items-center gap-7">
              <div className="flex w-full flex-col gap-5">
                <div className="grid w-full flex-1 gap-2">
                  <p className="font-secondary text-sm">Username</p>
                  <FormField
                    control={signInForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="username"
                            className="btn-shadow border border-gray-700 bg-white placeholder:text-gray-700"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid w-full flex-1 gap-2">
                  <p className="font-secondary text-sm">Password</p>
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PasswordInput
                            placeholder="*****"
                            className="btn-shadow border border-gray-700 bg-white placeholder:text-gray-700"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid w-full flex-1 gap-2">
                  <p className="font-secondary text-sm">Wallet Address</p>
                  <FormField
                    control={signInForm.control}
                    name="wallet"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            readOnly
                            contentEditable={false}
                            type="text"
                            placeholder="*****"
                            className="btn-shadow border border-gray-700 bg-white placeholder:text-gray-700"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full justify-end">
                    <span
                      className="cursor-pointer font-secondary text-sm font-bold text-black hover:underline hover:underline-offset-4"
                      onClick={handleConnectWallet}
                    >
                      {walletAddress
                        ? "Disconnect"
                        : "Connect Wallet"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-row justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={rememberMe}
                    id="terms"
                    className="bg-black text-black"
                    onClick={() => setRememberMe((prev) => !prev)}
                  />
                  <label
                    htmlFor="terms"
                    className="select-none font-secondary text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <Button
                className="active-card-shadow w-full border-[1px] border-black bg-light-green py-3 font-primary text-base capitalize hover:bg-light-green gap-3"
                disabled={loading}
                type="submit"
              >
                <p>login</p>
                {loading && <LoadingIcon />}
              </Button>
              <p className="flex font-secondary text-sm">
                Don’t have an account yet?&nbsp;
                <span
                  className="cursor-pointer font-secondary text-sm font-bold text-black"
                  onClick={handleOpenSignUp}
                >
                  Register
                </span>
              </p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
