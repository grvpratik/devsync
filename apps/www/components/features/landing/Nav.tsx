import React from "react";
import LoginButton from "www/components/login-button";
import { Button } from "www/components/ui/button";
import { SidebarTrigger } from "www/components/ui/sidebar";

const Nav = () => {
	return (
		<div className="flex justify-between w-full my-4 px-4">
			{" "}
			<SidebarTrigger />{" "}
			<LoginButton/>
		</div>
	);
};

export default Nav;
