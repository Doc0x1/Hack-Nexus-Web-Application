import ToolsBreadcrumb from '@/components/ToolsBreadcrumb';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-[65px]">
            <main className="flex w-full flex-col items-center px-4 pt-12">
                <div className="container mx-auto">
                    <ToolsBreadcrumb />
                    {children}
                </div>
            </main>
        </div>
    );
}
