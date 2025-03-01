import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Button } from "www/components/ui/button";
import { getSessionCookie } from "www/hooks/use-server-session";
import { api, isSuccess } from "www/lib/handler";
 interface SessionListData{
	
    sessionId: string;
    deviceInfo: {
      userAgent: string,
      ip: 'unknown'
    };
    createdAt: bigint,
    lastActivityAt: bigint,
    expiresAt: bigint,
    isCurrentSession: boolean
 
 }
const SettingsPage = async () => {
	const session = await getSessionCookie();
	if (!session) {
		return redirect("/");
	}
	const sessionlist = await api.get("user/auth/sessions", null, { session });
	console.log(sessionlist);
	if (!isSuccess(sessionlist)) {
		return <div>Failed to fetch sessions</div>;
	}
	function formatDate(timestamp: number) {
		return new Date(timestamp).toLocaleString();
	}
console.log(sessionlist.sessions)
	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Active Sessions</h1>
			<div className="space-y-4">
				{sessionlist &&
					sessionlist.sessions.map((sessionData: any) => (
						<div
							key={sessionData.createdAt}
							className="border p-4 rounded-lg flex justify-between items-center"
						>
							<div>
								<p className=" text-wrap ">
									{sessionData.deviceInfo &&
										sessionData.deviceInfo["userAgent"]}
								</p>
								<p className="font-medium">
									{sessionData.isCurrentSession ?
										"Current Session"
									:	"Other Device"}
								</p>
								<p className="text-sm text-gray-600">
									Created: {formatDate(sessionData.createdAt)}
								</p>
								<p className="text-sm text-gray-600">
									Last Active: {formatDate(sessionData.lastActivityAt)}
								</p>
								<p className="text-sm text-gray-600">
									Expires At: {formatDate(sessionData.expiresAt)}
								</p>
							</div>
							<form
								action={async () => {
									"use server";
									const logout = await api.post(
										"user/auth/logout/session",
										{ sessionId: sessionData.sessionId },
										{ session }
									);
									if (isSuccess(logout)) {
										revalidatePath("/setting", "page");
									}
									console.log("logout", logout);
								}}
							>
								<Button variant="destructive">Logout</Button>
							</form>
						</div>
					))}
			</div>
		</div>
	);
};

export default SettingsPage;
