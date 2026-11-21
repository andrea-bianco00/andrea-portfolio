import {NextResponse} from "next/server";
import {getSiteVisibility} from "../../site-visibility";

export const dynamic="force-dynamic";
export async function GET(){
 const values=await getSiteVisibility();
 return NextResponse.json({projects:values["page:progetti"]===true,certifications:values["page:certificazioni"]===true},{headers:{"Cache-Control":"no-store"}});
}
