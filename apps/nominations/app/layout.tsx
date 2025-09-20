import type {Metadata} from "next";
import "@workspace/ui/globals.css"

export const metadata: Metadata = {
    title: "Nominations - Handball Referees",
    description: "Find your next nominations as a handball referee from Belgian Handball Federation",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/urbh_logo.png" sizes="any"/>
        </head>
        <body
            className={`antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
