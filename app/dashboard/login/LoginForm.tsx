"use client";
import {useActionState} from "react";
import {signIn} from "../actions";
export default function LoginForm(){
 const [state,action,pending]=useActionState(signIn,{error:""});
 return <form action={action} className="tracker-form">
   <label>Email<input type="email" name="email" autoComplete="username" required placeholder="La tua email"/></label>
   <label>Password<input type="password" name="password" autoComplete="current-password" required placeholder="••••••••"/></label>
   {state.error&&<p role="alert" className="tracker-error">{state.error}</p>}
   <button className="tracker-button" disabled={pending}>{pending?"Accesso in corso…":"ACCEDI ALLA DASHBOARD ↗"}</button>
 </form>;
}
