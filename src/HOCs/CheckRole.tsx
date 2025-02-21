import LoadingIndicator from "@/app/components/LoadingIndicator";
import { GlobalContext } from "@/provider/global-provider";
import { JSX, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PermissionAccept = <T extends (s: any) => JSX.Element>(
  Component: T,
  expectedRoles: ("COLLECTOR" | "MODERATOR" | "ADMIN")[]
) => {
  return function AcceptedComponent(
    props: T extends (s: infer P) => JSX.Element ? P : unknown
  ) {
    const { user, isFetchingUser } = useContext(GlobalContext);
    const userRole = user?.mainRole;

    const isAccept = expectedRoles.includes(
      userRole as "COLLECTOR" | "MODERATOR" | "ADMIN"
    );

    if (isFetchingUser) {
      return (
        <div className="w-screen h-screen flex items-center justify-center">
          <LoadingIndicator />
        </div>
      );
    }
    return isAccept ? (
      <Component {...props} />
    ) : (
      <div className="absolute left-0 top-0 z-[99999] h-screen w-screen bg-white">
        Bạn không có quyền truy cập trang này
      </div>
    );
  };
};

export default PermissionAccept;
