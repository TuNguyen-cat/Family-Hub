import { useRef, useState } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Globe,
  Home,
  Key,
  Lock,
  LogOut,
  Moon,
  MoreHorizontal,
  Palette,
  Pen,
  Plus,
  Save,
  Shield,
  Sparkles,
  Sun,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP)

const SETTINGS_SECTIONS = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "family", label: "Family Management", icon: Home },
  { id: "members", label: "Family Members", icon: Users },
  { id: "roles", label: "Roles & Permissions", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "ai-data", label: "AI & Data Permissions", icon: Sparkles },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Lock },
]

const MEMBERS = [
  { id: 1, name: "Dad", role: "Admin", status: "Online", avatar: "👨", email: "dad@nguyen.family" },
  { id: 2, name: "Mom", role: "Admin", status: "Online", avatar: "👩", email: "mom@nguyen.family" },
  { id: 3, name: "Minh", role: "Member", status: "Online", avatar: "👦", email: "minh@nguyen.family" },
  { id: 4, name: "An", role: "Member", status: "Away", avatar: "👧", email: "an@nguyen.family" },
]

const ROLES = [
  {
    id: "admin",
    name: "ADMIN",
    description: "Full access to family management",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    permissions: [
      "Manage family members",
      "Manage family settings",
      "Manage permissions",
      "Manage shared financial settings",
    ],
  },
  {
    id: "member",
    name: "MEMBER",
    description: "Standard family member access",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    permissions: [
      "View shared calendar",
      "Create and complete tasks",
      "Participate in shared shopping lists",
      "Access features based on family permissions",
    ],
  },
]

const NOTIFICATION_GROUPS = [
  {
    category: "Calendar",
    items: [
      { id: "event-reminders", label: "Event reminders" },
      { id: "family-invitations", label: "Family event invitations" },
    ],
  },
  {
    category: "Tasks",
    items: [
      { id: "new-tasks", label: "New task assignments" },
      { id: "task-due", label: "Task due reminders" },
    ],
  },
  {
    category: "Finance",
    items: [{ id: "budget-alerts", label: "Budget alerts" }],
  },
  {
    category: "Shopping",
    items: [{ id: "new-items", label: "New item notifications" }],
  },
  {
    category: "Family AI",
    items: [{ id: "ai-insights", label: "New insights and suggestions" }],
  },
]

const AI_PERMISSIONS = [
  { id: "calendar", label: "Calendar data", description: "Events, schedules, availability" },
  { id: "tasks", label: "Household task data", description: "Assignments, completion status, distribution" },
  { id: "finance", label: "Finance data", description: "Budgets, spending, transactions" },
  { id: "shopping", label: "Shopping list data", description: "Items, quantities, estimated costs" },
  { id: "rewards", label: "Rewards & family goals", description: "XP, goals, achievements" },
]

export default function Settings() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)

  useGSAP(
    () => {
      gsap.fromTo(
        ".settings-fade",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" },
      )
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className="h-full flex min-h-0">
      {/* LEFT SETTINGS NAVIGATION */}
      <aside className="w-64 shrink-0 border-r border-cream-50/10 bg-night-900 flex flex-col hidden lg:flex">
        <div className="p-4 border-b border-cream-50/10">
          <h2 className="font-display text-lg text-cream-50">Settings</h2>
          <p className="mt-1 text-xs text-bark-500">Manage your account and family preferences</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {SETTINGS_SECTIONS.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-lamp-400/10 text-lamp-300"
                    : "text-bark-400 hover:bg-cream-50/5 hover:text-cream-100",
                )}
              >
                <Icon className="size-4.5 shrink-0" />
                {section.label}
                {isActive && <span className="ml-auto size-1.5 rounded-full bg-lamp-400" />}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-cream-50/10">
          <p className="text-xs text-bark-500 text-center">FamilyHub v2.6.0</p>
        </div>
      </aside>

      {/* RIGHT SETTINGS CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* MY PROFILE */}
          {activeSection === "profile" && (
            <div className="settings-fade space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl text-cream-50">My Profile</h1>
                  <p className="text-sm text-bark-400">Manage your personal information</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex size-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-cream-50 text-3xl">
                        👦
                      </div>
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute bottom-0 right-0 -translate-y-1/2 translate-x-1/2"
                        >
                          <Pen className="size-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-cream-50">Minh Nguyen</h3>
                      <p className="text-sm text-bark-400">minh@nguyen.family</p>
                      <p className="text-xs text-bark-500">Family role: Member</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        defaultValue="Minh Nguyen"
                        disabled={!isEditing}
                        className={cn(!isEditing && "bg-transparent border-none")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="minh@nguyen.family"
                        disabled={!isEditing}
                        className={cn(!isEditing && "bg-transparent border-none")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue="+84 90 123 4567"
                        disabled={!isEditing}
                        className={cn(!isEditing && "bg-transparent border-none")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Preferred Language</Label>
                      <select
                        id="language"
                        className="w-full rounded-lg border border-cream-50/10 bg-night-800/60 py-2 px-3 text-sm text-cream-100 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none"
                        disabled={!isEditing}
                      >
                        <option>English</option>
                        <option>Vietnamese</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Time Zone</Label>
                      <select
                        id="timezone"
                        className="w-full rounded-lg border border-cream-50/10 bg-night-800/60 py-2 px-3 text-sm text-cream-100 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none"
                        disabled={!isEditing}
                      >
                        <option>Asia/Ho_Chi_Minh (UTC+7)</option>
                        <option>UTC</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-cream-50/10">
                    {isEditing ? (
                      <>
                        <Button variant="secondary" onClick={() => setIsEditing(false)}>
                          <X className="size-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={() => setIsEditing(false)}>
                          <Save className="size-4 mr-2" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Pen className="size-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* FAMILY MANAGEMENT */}
          {activeSection === "family" && (
            <div className="settings-fade space-y-6">
              <div>
                <h1 className="font-display text-2xl text-cream-50">Family Management</h1>
                <p className="text-sm text-bark-400">Manage your family space</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Family Information</CardTitle>
                  <CardDescription>Basic details about your family space</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="familyName">Family Name</Label>
                    <Input id="familyName" defaultValue="Nguyen Family" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="familyDesc">Family Description</Label>
                    <Input id="familyDesc" defaultValue="Our shared family space" disabled />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-3 rounded-lg bg-night-700/50">
                      <p className="text-xs text-bark-500">Members</p>
                      <p className="font-display text-2xl text-cream-50">4</p>
                    </div>
                    <div className="p-3 rounded-lg bg-night-700/50">
                      <p className="text-xs text-bark-500">Created</p>
                      <p className="font-medium text-cream-100">January 2024</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-cream-50/10">
                    <Button variant="outline">Edit Family</Button>
                    <Button variant="outline">
                      <Plus className="size-4 mr-2" />
                      Invite Member
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-lamp-400/20 bg-gradient-to-br from-lamp-400/5 via-transparent to-blue-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="size-5 text-lamp-400" />
                    Family Invite Code
                  </CardTitle>
                  <CardDescription>Share this code to invite family members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 p-4 rounded-lg bg-night-800/50 border border-cream-50/10 font-mono text-lg text-lamp-300 tracking-wider">
                      FH-2026-AB12
                    </div>
                    <Button variant="default" className="bg-lamp-400 hover:bg-lamp-300">
                      Copy Invite Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* FAMILY MEMBERS */}
          {activeSection === "members" && (
            <div className="settings-fade space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl text-cream-50">Family Members</h1>
                  <p className="text-sm text-bark-400">Manage family members and their roles</p>
                </div>
                <Button variant="default">
                  <Plus className="size-4 mr-2" />
                  Invite Family Member
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="divide-y divide-cream-50/5">
                    {MEMBERS.map((member) => (
                      <div key={member.id} className="p-4 flex items-center justify-between hover:bg-cream-50/3 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="flex size-12 items-center justify-center rounded-xl bg-night-700 text-xl">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-cream-100">{member.name}</p>
                            <p className="text-sm text-bark-400">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            member.role === "Admin"
                              ? "bg-purple-500/20 text-purple-300"
                              : "bg-blue-500/20 text-blue-300",
                          )}>
                            {member.role}
                          </span>
                          <span className={cn(
                            "flex items-center gap-1 text-xs",
                            member.status === "Online"
                              ? "text-leaf-300"
                              : "text-lamp-300",
                          )}>
                            <span className={cn(
                              "size-1.5 rounded-full",
                              member.status === "Online" ? "bg-leaf-400" : "bg-lamp-400",
                            )} />
                            {member.status}
                          </span>
                          <Button variant="ghost" size="icon" className="text-bark-400 hover:text-cream-100">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Member Actions</CardTitle>
                  <CardDescription>Available actions for family members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Button variant="outline">
                      <Shield className="size-4 mr-2" />
                      Change Role
                    </Button>
                    <Button variant="outline" className="text-rose-400 border-rose-500/20 hover:bg-rose-500/10">
                      <Trash2 className="size-4 mr-2" />
                      Remove Member
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ROLES & PERMISSIONS */}
          {activeSection === "roles" && (
            <div className="settings-fade space-y-6">
              <div>
                <h1 className="font-display text-2xl text-cream-50">Roles & Permissions</h1>
                <p className="text-sm text-bark-400">Understand what each role can do</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {ROLES.map((role) => (
                  <Card key={role.id} className={cn("border-l-4", role.border)}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={cn("text-xs font-medium tracking-widest uppercase", role.color)}>
                            {role.name}
                          </span>
                          <h3 className="font-display text-lg text-cream-50 mt-1">{role.description}</h3>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {role.permissions.map((perm, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-bark-400">
                            <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-night-700 text-lamp-400">
                              ✓
                            </span>
                            {perm}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <div className="settings-fade space-y-6">
              <div>
                <h1 className="font-display text-2xl text-cream-50">Notifications</h1>
                <p className="text-sm text-bark-400">Configure when and how you receive notifications</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Toggle notifications for each category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {NOTIFICATION_GROUPS.map((group) => (
                      <div key={group.category} className="space-y-3">
                        <h4 className="text-sm font-semibold tracking-widest text-cream-50 uppercase">{group.category}</h4>
                        <div className="space-y-2 pl-2 border-l border-cream-50/10">
                          {group.items.map((item) => (
                            <label key={item.id} className="flex items-center justify-between cursor-pointer">
                              <span className="text-sm text-cream-100">{item.label}</span>
                              <input
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 rounded border-cream-50/20 bg-night-800 text-lamp-400 focus:ring-lamp-400"
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quiet Hours</CardTitle>
                  <CardDescription>Pause notifications during specific hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quietStart">Start Time</Label>
                      <Input id="quietStart" type="time" defaultValue="22:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quietEnd">End Time</Label>
                      <Input id="quietEnd" type="time" defaultValue="07:00" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI & DATA PERMISSIONS */}
          {activeSection === "ai-data" && (
            <div className="settings-fade space-y-6">
              <div>
                <h1 className="font-display text-2xl text-cream-50">AI & Data Permissions</h1>
                <p className="text-sm text-bark-400">Control what information Family AI can access</p>
              </div>

              <Card className="border-lamp-400/20 bg-gradient-to-br from-lamp-400/5 via-transparent to-blue-500/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-lamp-400/20 text-lamp-400">
                      <Sparkles className="size-4" />
                    </div>
                    <CardTitle>Family AI Privacy</CardTitle>
                  </div>
                  <CardDescription>
                    Family AI only uses information that your family chooses to share. You have full control over what data is accessible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {AI_PERMISSIONS.map((perm) => (
                      <label key={perm.id} className="flex items-center justify-between p-3 rounded-lg bg-night-700/50 hover:bg-cream-50/3 transition-colors cursor-pointer">
                        <div className="flex-1">
                          <p className="font-medium text-cream-100">{perm.label}</p>
                          <p className="text-xs text-bark-500">{perm.description}</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-5 w-5 rounded border-cream-50/20 bg-night-800 text-lamp-400 focus:ring-lamp-400 shrink-0 ml-4"
                        />
                      </label>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-4 w-full border-lamp-400/30 text-lamp-300 hover:bg-lamp-400/10">
                    Review Data Permissions
                    <ArrowRight className="size-3.5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* APPEARANCE */}
          {activeSection === "appearance" && (
            <div className="settings-fade space-y-6">
              <div>
                <h1 className="font-display text-2xl text-cream-50">Appearance</h1>
                <p className="text-sm text-bark-400">Customize how FamilyHub looks</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                  <CardDescription>Choose your preferred color scheme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { id: "light", label: "Light Mode", icon: Sun, desc: "Bright and clean" },
                      { id: "dark", label: "Dark Mode", icon: Moon, desc: "Easy on the eyes" },
                      { id: "system", label: "System Default", icon: Globe, desc: "Follows system setting" },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        className={cn(
                          "relative p-4 rounded-xl border-2 text-left transition-all",
                          theme.id === "dark"
                            ? "border-lamp-400 bg-lamp-400/10"
                            : "border-cream-50/10 hover:border-lamp-400/30",
                        )}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-night-700">
                            <theme.icon className="size-5 text-lamp-400" />
                          </div>
                          <div>
                            <p className="font-medium text-cream-100">{theme.label}</p>
                            <p className="text-xs text-bark-400">{theme.desc}</p>
                          </div>
                        </div>
                        {theme.id === "dark" && (
                          <div className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-lamp-400 text-night-900">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Language & Format</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="lang">Language</Label>
                    <select
                      id="lang"
                      className="w-full rounded-lg border border-cream-50/10 bg-night-800/60 py-2 px-3 text-sm text-cream-100 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none"
                    >
                      <option>English</option>
                      <option>Vietnamese</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <select
                      id="dateFormat"
                      className="w-full rounded-lg border border-cream-50/10 bg-night-800/60 py-2 px-3 text-sm text-cream-100 focus:ring-2 focus:ring-lamp-400/40 focus:outline-none"
                    >
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* SECURITY */}
          {activeSection === "security" && (
            <div className="settings-fade space-y-6">
              <div>
                <h1 className="font-display text-2xl text-cream-50">Security</h1>
                <p className="text-sm text-bark-400">Manage your account security</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-night-700/50">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                        <Key className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium text-cream-100">Change Password</p>
                        <p className="text-sm text-bark-400">Update your password</p>
                      </div>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-night-700/50">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                        <Shield className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium text-cream-100">Two-Factor Authentication</p>
                        <p className="text-sm text-bark-400">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-night-700/50">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                        <CalendarDays className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium text-cream-100">Active Sessions</p>
                        <p className="text-sm text-bark-400">Manage logged-in devices</p>
                      </div>
                    </div>
                    <Button variant="outline">View</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-night-700/50">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                        <Bell className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium text-cream-100">Login Alerts</p>
                        <p className="text-sm text-bark-400">Get notified of new logins</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-5 w-5 rounded border-cream-50/20 bg-night-800 text-lamp-400 focus:ring-lamp-400"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-rose-500/20 bg-rose-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-rose-400">
                    <Trash2 className="size-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-night-700/50">
                    <div>
                      <p className="font-medium text-cream-100">Leave Family</p>
                      <p className="text-sm text-bark-400">Remove yourself from this family space</p>
                    </div>
                    <Button variant="outline" className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10">
                      Leave
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-night-700/50">
                    <div>
                      <p className="font-medium text-cream-100">Delete Account</p>
                      <p className="text-sm text-bark-400">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="outline" className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="pt-4 border-t border-cream-50/10">
                <Button variant="ghost" className="text-bark-400 hover:text-rose-400 w-full">
                  <LogOut className="size-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}