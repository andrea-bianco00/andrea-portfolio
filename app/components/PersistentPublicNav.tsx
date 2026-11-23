"use client";

import {usePathname} from "next/navigation";
import SiteNav from "./SiteNav";

const publicPaths = new Set(["/","/about","/ricerca","/progetti","/cv","/certificazioni"]);

/**
 * Lives in the root layout rather than each page, so navigating between
 * public pages never unmounts/remounts the sidebar or its visibility state.
 */
export default function PersistentPublicNav(){
 const pathname=usePathname();
 const isPublic=publicPaths.has(pathname)||pathname.startsWith("/progetti/");
 if(!isPublic)return null;
 return <div className="cozy-page cozy-nav-host"><SiteNav/></div>;
}
