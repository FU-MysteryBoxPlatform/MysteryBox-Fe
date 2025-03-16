import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateBankAccount } from "@/hooks/api/useAccount";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const UpdateBankAccountSchema = z.object({
  bankName: z.string().min(1, "Vui lòng nhập tên ngân hàng"),
  bankAccountNumber: z.string().min(1, "Vui lòng nhập số tài khoản"),
});

type UpdateBankAccountForm = z.infer<typeof UpdateBankAccountSchema>;

export default function FormUpdateBankAccount({
  accountId,
  bankName,
  bankAccountNumber,
  onClose,
}: {
  accountId: string;
  bankName?: string;
  bankAccountNumber?: string;
  onClose?: () => void;
}) {
  const { handleSubmit, register, formState } = useForm<UpdateBankAccountForm>({
    resolver: zodResolver(UpdateBankAccountSchema),
    defaultValues: {
      bankName: bankName || "",
      bankAccountNumber: bankAccountNumber || "",
    },
  });

  const { mutate: mutateUpdateBankAccount, isPending } = useUpdateBankAccount();

  const onsubmit = (data: UpdateBankAccountForm) => {
    mutateUpdateBankAccount(
      {
        accountId,
        bankName: data.bankName,
        bankAccountNumber: data.bankAccountNumber,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({
              title: "Cập nhật thành công!",
            });
            onClose?.();
          } else {
            toast({
              title: data.messages[0],
            });
          }
        },
      }
    );
  };

  return (
    <div>
      <form className="grid gap-4 mb-4">
        <div className="flex flex-col space-y-1.5 col-span-2">
          <Label htmlFor="bankName">Tên ngân hàng</Label>
          <Input
            id="bankName"
            placeholder="Nhập tên ngân hàng"
            {...register("bankName")}
          />
          {formState.errors.bankName && (
            <p className="text-red-500 text-sm">
              {formState.errors.bankName.message}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-1.5 col-span-2">
          <Label htmlFor="bankAccountNumber">Số tài khoản</Label>
          <Input
            id="bankAccountNumber"
            placeholder="Nhập tên ngân hàng"
            {...register("bankAccountNumber")}
          />
          {formState.errors.bankAccountNumber && (
            <p className="text-red-500 text-sm">
              {formState.errors.bankAccountNumber.message}
            </p>
          )}
        </div>
      </form>
      <Button
        className="bg-[#E12E43] text-white hover:bg-[#B71C32] w-full"
        onClick={handleSubmit(onsubmit)}
      >
        {isPending ? <LoadingIndicator /> : "Cập nhật"}
      </Button>
    </div>
  );
}
