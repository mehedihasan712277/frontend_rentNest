import type { ReactNode } from "react";

interface PrivatePageLayoutProps {
    children: ReactNode;
}

const PrivatePageLayout = ({ children }: PrivatePageLayoutProps) => {
    return <div className="min-h-screen">{children}</div>;
};

export default PrivatePageLayout;
