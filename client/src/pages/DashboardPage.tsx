import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Trash2,
  UserRound,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Entry = {
  id: number;
  title: string;
  completed: boolean;
};

type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

type DashboardData = {
  account: { id: number; email: string } | null;
  entries: Entry[];
  contactSubmissions: ContactSubmission[];
};

export default function DashboardPage() {
  const [data, setData] = React.useState<DashboardData>({
    account: null,
    entries: [],
    contactSubmissions: [],
  });
  const [search, setSearch] = React.useState("");
  const [newEntry, setNewEntry] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"dashboard" | "entries" | "contacts" | "profile">("dashboard");
  const [status, setStatus] = React.useState<{
    type: "" | "error";
    message: string;
  }>({
    type: "",
    message: "",
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();

  const loadDashboard = React.useCallback(async () => {
    setIsLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const response = await apiRequest("/dashboard");
      setData({
        account: response.account ?? null,
        entries: response.entries ?? [],
        contactSubmissions: response.contactSubmissions ?? [],
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to load data",
      });
      if (!getToken()) {
        navigate("/auth");
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  React.useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleAddEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newEntry.trim()) {
      return;
    }

    try {
      await apiRequest("/todos", {
        method: "POST",
        body: { title: newEntry.trim() },
      });
      setNewEntry("");
      await loadDashboard();
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to add entry",
      });
    }
  };

  const handleCompleteEntry = async (entryId: number) => {
    try {
      await apiRequest(`/todos/${entryId}`, {
        method: "PUT",
        body: { completed: true },
      });
      await loadDashboard();
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to update entry",
      });
    }
  };

  const handleDeleteEntry = async (entryId: number) => {
    try {
      await apiRequest(`/todos/${entryId}`, {
        method: "DELETE",
      });
      await loadDashboard();
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to delete entry",
      });
    }
  };

  const handleSignOut = () => {
    clearToken();
    navigate("/auth");
  };

  const query = search.trim().toLowerCase();
  const filteredEntries = data.entries.filter((entry) =>
    entry.title.toLowerCase().includes(query),
  );
  const filteredContacts = data.contactSubmissions.filter((contact) =>
    [contact.name, contact.email, contact.message]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );

  const completedCount = data.entries.filter((entry) => entry.completed).length;

  return (
    <SidebarProvider className="bg-transparent">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 text-sm font-bold text-white shadow-pink-glow">
              T9
            </div>
            <div className="text-sm">
              <p className="font-semibold">Tech9Labs</p>
              <p className="text-xs text-sidebar-foreground/70">
                Operations Hub
              </p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")}>
                    <LayoutDashboard className="size-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "entries"} onClick={() => setActiveTab("entries")}>
                    <ClipboardList className="size-4" />
                    <span>Entries</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "contacts"} onClick={() => setActiveTab("contacts")}>
                    <MessageSquare className="size-4" />
                    <span>Contact Inbox</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col gap-2 p-2">
            <Button
              variant={activeTab === "profile" ? "secondary" : "ghost"}
              className="justify-start gap-2 text-sidebar-foreground hover:bg-white/10 hover:text-white"
              onClick={() => setActiveTab("profile")}
            >
              <Settings className="size-4" />
              Profile
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-rose-200 hover:bg-rose-500/15 hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex min-h-16 w-full shrink-0 flex-wrap items-center justify-between gap-4 border-b border-white/60 bg-white/55 px-4 py-3 shadow-glass-sm backdrop-blur-2xl md:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <p className="text-xs text-muted-foreground">Welcome back</p>
              <h1 className="text-lg font-semibold md:text-xl">
                {data.account?.email || "Account"}
              </h1>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-3 sm:flex-none">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search entries and messages"
                className="pl-9"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-full overflow-hidden space-y-6 px-4 py-6 md:px-6">
          {status.message && (
            <div
              className={
                status.type === "error"
                  ? "rounded-lg border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-700 shadow-glass-sm backdrop-blur-xl"
                  : "rounded-lg border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700 shadow-glass-sm backdrop-blur-xl"
              }
            >
              {status.message}
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="card-surface">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total entries
                    </p>
                    <p className="mt-2 text-3xl font-semibold">
                      {data.entries.length}
                    </p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-lg bg-pink-100 text-primary">
                    <ClipboardList className="size-5" />
                  </div>
                </div>
              </div>
              <div className="card-surface">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="mt-2 text-3xl font-semibold">
                      {completedCount}
                    </p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="size-5" />
                  </div>
                </div>
              </div>
              <div className="card-surface">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Contact submissions
                    </p>
                    <p className="mt-2 text-3xl font-semibold">
                      {data.contactSubmissions.length}
                    </p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                    <MessageSquare className="size-5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === "dashboard" || activeTab === "entries") && (
            <div className="card-surface max-w-5xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Entries</h2>
                  <p className="text-sm text-muted-foreground">
                    Track work items, updates, and operational notes.
                  </p>
                </div>
                <span className="rounded-full border border-white/70 bg-white/55 px-3 py-1 text-xs font-semibold text-primary shadow-glass-sm backdrop-blur-xl">
                  {filteredEntries.length} items
                </span>
              </div>

              <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleAddEntry}>
                <Input
                  value={newEntry}
                  onChange={(event) => setNewEntry(event.target.value)}
                  placeholder="Add a new entry"
                />
                <Button type="submit">
                  <Plus className="size-4" />
                  Add
                </Button>
              </form>

              <div className="mt-6 space-y-3">
                {isLoading && (
                  <p className="text-sm text-muted-foreground">
                    Loading entries...
                  </p>
                )}
                {!isLoading && filteredEntries.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No entries found. Add a new entry to get started.
                  </p>
                )}
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="glass-tile flex flex-wrap items-center justify-between gap-3 p-4"
                  >
                    <div>
                      <p
                        className={
                          entry.completed
                            ? "text-sm line-through text-muted-foreground"
                            : "text-sm"
                        }
                      >
                        {entry.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Entry ID: {entry.id}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={entry.completed}
                        onClick={() => handleCompleteEntry(entry.id)}
                      >
                        <CheckCircle2 className="size-4" />
                        Mark done
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 className="size-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === "dashboard" || activeTab === "contacts") && (
            <div className="card-surface max-w-5xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Contact submissions</h2>
                  <p className="text-sm text-muted-foreground">
                    Messages submitted from the landing page.
                  </p>
                </div>
                <span className="rounded-full border border-white/70 bg-white/55 px-3 py-1 text-xs font-semibold text-primary shadow-glass-sm backdrop-blur-xl">
                  {filteredContacts.length} messages
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {isLoading && (
                  <p className="text-sm text-muted-foreground">
                    Loading messages...
                  </p>
                )}
                {!isLoading && filteredContacts.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No contact messages yet.
                  </p>
                )}
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="glass-tile p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-primary">
                        <UserRound className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {contact.email}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {contact.message}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(contact.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="card-surface max-w-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-600 to-pink-500 text-white shadow-pink-glow">
                  <UserRound className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Profile & Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your account preferences here.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-tile p-4">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <p className="text-sm text-muted-foreground">{data.account?.email}</p>
                </div>
                
                <div className="border-t border-white/60 pt-4">
                  <h3 className="text-sm font-medium mt-2">Security</h3>
                  <Button variant="outline" className="mt-3">
                    <Settings className="size-4" />
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
