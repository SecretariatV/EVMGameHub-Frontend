import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalType } from "@/types/modal";
import useModal from "@/hooks/use-modal";
import useToast from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { axiosPost } from "@/utils/axios";
import { BACKEND_API_ENDPOINT } from "@/utils/constant";
import { useAppSelector } from "@/store/redux";
import { PasswordInput } from "@/components/ui/password-input";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAccount, useDisconnect } from "wagmi";

const SignUpSchema = z
  .object({
    username: z.string().nonempty("Full Name is required"),
    wallet: z.string().nonempty("Wallet is required"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().nonempty("Confirm Password is required"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords must match",
        path: ["confirmPassword"],
      });
    }
  });

const SignUpDefaultValue = {
  username: "",
  password: "",
  confirmPassword: "",
  wallet: "",
};

const SignUpModal = () => {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { open, type } = useAppSelector((state: any) => state.modal);
  const modal = useModal();
  const toast = useToast();
  const { address: walletAddress } = useAccount();
  const { disconnect } = useDisconnect();
  const isOpen = open && type === ModalType.SIGNUP;

  const signUpForm = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: SignUpDefaultValue,
  });

  const handleSignIn = async () => {
    modal.open(ModalType.LOGIN);
  };

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.SIGNUP);
    }
  };

  const handleConnectWallet = async () => {
    try {
      disconnect();
      if (walletAddress) {
        signUpForm.setValue("wallet", "");
        return;
      }
      modal.open(ModalType.WALLETCONNECT, ModalType.SIGNUP);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    try {
      if (!agreeTerms) {
        toast.error("Please agree to the terms and conditions");
        return;
      }
      const signUpPayload = {
        username: data.username,
        password: data.password,
        signAddress: data.wallet,
      };
      await axiosPost([
        BACKEND_API_ENDPOINT.auth.signUp,
        { data: signUpPayload },
      ]);
      modal.close(ModalType.SIGNUP);
      modal.open(ModalType.LOGIN);
      toast.success("SignUp Success");
    } catch (error: any) {
      toast.error(error?.error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      signUpForm.setValue("wallet", walletAddress);
    }
  }, [walletAddress]);
  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="rounded-lg border-2 border-primary bg-primary p-10 text-black sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center font-primary text-3xl text-black">
            REGISTER
          </DialogTitle>
        </DialogHeader>
        <Form {...signUpForm}>
          <form onSubmit={signUpForm.handleSubmit(handleSubmit)}>
            <div className="mt-3 flex flex-col items-center gap-7">
              <div className="flex w-full flex-col gap-3">
                <div className="grid w-full flex-1 gap-2">
                  <p className="font-secondary text-sm">Username</p>
                  <FormField
                    control={signUpForm.control}
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
                    control={signUpForm.control}
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
                  <p className="font-secondary text-sm">Confirm Password</p>
                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
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
                    control={signUpForm.control}
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
                      {walletAddress ? "Disconnect" : "Connect Wallet"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-row justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={agreeTerms}
                    id="terms"
                    className="bg-black text-black"
                    onClick={() => setAgreeTerms((prev) => !prev)}
                  />
                  <label
                    htmlFor="terms"
                    className="select-none font-secondary text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Agree to our Terms & Conditions
                  </label>
                </div>
              </div>
              <Button
                type="submit"
                className="active-card-shadow w-full border-[1px] border-black bg-light-green py-3 font-primary text-base capitalize hover:bg-light-green"
              >
                Register
              </Button>
              <p className="flex font-secondary text-sm">
                Already have an account ?&nbsp;
                <span
                  className="cursor-pointer font-bold text-black"
                  onClick={handleSignIn}
                >
                  Login
                </span>
                &nbsp;to start
              </p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;
