"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flag, Plus, Settings, Users, Zap, Shield, Palette, Bell } from "lucide-react"

interface FeatureFlag {
  id: number
  name: string
  key: string
  description: string
  enabled: boolean
  rolloutPercentage: number
  targetShops: string[]
  category: "ui" | "functionality" | "security" | "performance"
  created: string
  lastModified: string
}

export default function FeatureFlagsPage() {
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [features, setFeatures] = useState<FeatureFlag[]>([
    {
      id: 1,
      name: "New Dashboard UI",
      key: "new_dashboard_ui",
      description: "Updated dashboard interface with improved analytics",
      enabled: true,
      rolloutPercentage: 75,
      targetShops: ["TechStore Pro", "Fashion Hub"],
      category: "ui",
      created: "2024-01-15",
      lastModified: "2024-01-20",
    },
    {
      id: 2,
      name: "Advanced Inventory Management",
      key: "advanced_inventory",
      description: "Enhanced inventory tracking with predictive analytics",
      enabled: false,
      rolloutPercentage: 25,
      targetShops: ["TechStore Pro"],
      category: "functionality",
      created: "2024-01-10",
      lastModified: "2024-01-18",
    },
    {
      id: 3,
      name: "Two-Factor Authentication",
      key: "two_factor_auth",
      description: "Enhanced security with 2FA for all user accounts",
      enabled: true,
      rolloutPercentage: 100,
      targetShops: [],
      category: "security",
      created: "2024-01-05",
      lastModified: "2024-01-19",
    },
    {
      id: 4,
      name: "Performance Optimization",
      key: "performance_boost",
      description: "Database query optimization and caching improvements",
      enabled: true,
      rolloutPercentage: 50,
      targetShops: ["Home Essentials", "Sports Central"],
      category: "performance",
      created: "2024-01-12",
      lastModified: "2024-01-21",
    },
  ])

  const [newFeature, setNewFeature] = useState({
    name: "",
    key: "",
    description: "",
    enabled: false,
    rolloutPercentage: 0,
    targetShops: [] as string[],
    category: "functionality" as const,
  })

  const handleToggleFeature = (featureId: number) => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === featureId
          ? { ...feature, enabled: !feature.enabled, lastModified: new Date().toISOString().split("T")[0] }
          : feature,
      ),
    )

    const feature = features.find((f) => f.id === featureId)
    toast({
      title: `Feature ${feature?.enabled ? "Disabled" : "Enabled"}`,
      description: `${feature?.name} has been ${feature?.enabled ? "disabled" : "enabled"}.`,
    })
  }

  const handleRolloutChange = (featureId: number, percentage: number) => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === featureId
          ? { ...feature, rolloutPercentage: percentage, lastModified: new Date().toISOString().split("T")[0] }
          : feature,
      ),
    )

    const feature = features.find((f) => f.id === featureId)
    toast({
      title: "Rollout Updated",
      description: `${feature?.name} rollout set to ${percentage}%.`,
    })
  }

  const handleAddFeature = () => {
    if (!newFeature.name || !newFeature.key || !newFeature.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const feature: FeatureFlag = {
      ...newFeature,
      id: Math.max(...features.map((f) => f.id)) + 1,
      created: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
    }

    setFeatures((prev) => [...prev, feature])
    setIsAddDialogOpen(false)
    setNewFeature({
      name: "",
      key: "",
      description: "",
      enabled: false,
      rolloutPercentage: 0,
      targetShops: [],
      category: "functionality",
    })

    toast({
      title: "Feature Flag Created",
      description: `${newFeature.name} has been created successfully.`,
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ui":
        return Palette
      case "functionality":
        return Zap
      case "security":
        return Shield
      case "performance":
        return Settings
      default:
        return Flag
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ui":
        return "bg-blue-100 text-blue-800"
      case "functionality":
        return "bg-green-100 text-green-800"
      case "security":
        return "bg-red-100 text-red-800"
      case "performance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = [
    {
      title: "Total Features",
      value: features.length.toString(),
      change: `${features.filter((f) => f.enabled).length} enabled`,
      icon: Flag,
    },
    {
      title: "Active Features",
      value: features.filter((f) => f.enabled).length.toString(),
      change: "+2 this week",
      icon: Zap,
    },
    {
      title: "In Testing",
      value: features.filter((f) => f.rolloutPercentage < 100 && f.rolloutPercentage > 0).length.toString(),
      change: "3 features",
      icon: Settings,
    },
    {
      title: "Full Rollout",
      value: features.filter((f) => f.rolloutPercentage === 100).length.toString(),
      change: "Production ready",
      icon: Users,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Feature Flags</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Feature Flag
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Feature Flag</DialogTitle>
                <DialogDescription>Create a new feature flag to control feature rollouts.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={newFeature.name}
                    onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Feature display name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="key" className="text-right">
                    Key *
                  </Label>
                  <Input
                    id="key"
                    value={newFeature.key}
                    onChange={(e) =>
                      setNewFeature({ ...newFeature, key: e.target.value.toLowerCase().replace(/\s+/g, "_") })
                    }
                    className="col-span-3"
                    placeholder="feature_key_name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select
                    value={newFeature.category}
                    onValueChange={(value: any) => setNewFeature({ ...newFeature, category: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ui">UI/UX</SelectItem>
                      <SelectItem value="functionality">Functionality</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={newFeature.description}
                    onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                    className="col-span-3"
                    placeholder="Describe what this feature does"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rollout" className="text-right">
                    Initial Rollout %
                  </Label>
                  <Input
                    id="rollout"
                    type="number"
                    min="0"
                    max="100"
                    value={newFeature.rolloutPercentage}
                    onChange={(e) => setNewFeature({ ...newFeature, rolloutPercentage: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Enabled</Label>
                  <Switch
                    checked={newFeature.enabled}
                    onCheckedChange={(checked) => setNewFeature({ ...newFeature, enabled: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddFeature}>Create Feature Flag</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Flags Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const CategoryIcon = getCategoryIcon(feature.category)
          return (
            <Card key={feature.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CategoryIcon className="h-5 w-5" />
                    <CardTitle className="text-lg">{feature.name}</CardTitle>
                  </div>
                  <Switch checked={feature.enabled} onCheckedChange={() => handleToggleFeature(feature.id)} />
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(feature.category)}>{feature.category}</Badge>
                  <Badge variant={feature.enabled ? "default" : "secondary"}>
                    {feature.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{feature.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Rollout Percentage</Label>
                    <span className="text-sm font-medium">{feature.rolloutPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${feature.rolloutPercentage}%` }}
                    />
                  </div>
                  <div className="flex space-x-1">
                    {[0, 25, 50, 75, 100].map((percentage) => (
                      <Button
                        key={percentage}
                        variant={feature.rolloutPercentage === percentage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleRolloutChange(feature.id, percentage)}
                        className="flex-1 text-xs"
                      >
                        {percentage}%
                      </Button>
                    ))}
                  </div>
                </div>

                {feature.targetShops.length > 0 && (
                  <div>
                    <Label className="text-sm">Target Shops</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {feature.targetShops.map((shop) => (
                        <Badge key={shop} variant="outline" className="text-xs">
                          {shop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1">
                  <div>
                    Key: <code className="bg-muted px-1 rounded">{feature.key}</code>
                  </div>
                  <div>Created: {feature.created}</div>
                  <div>Last Modified: {feature.lastModified}</div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common feature flag operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => {
                features.forEach((f) => {
                  if (!f.enabled) handleToggleFeature(f.id)
                })
                toast({
                  title: "All Features Enabled",
                  description: "All feature flags have been enabled.",
                })
              }}
            >
              <Zap className="h-6 w-6" />
              <span>Enable All</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => {
                features.forEach((f) => {
                  if (f.enabled) handleToggleFeature(f.id)
                })
                toast({
                  title: "All Features Disabled",
                  description: "All feature flags have been disabled.",
                })
              }}
            >
              <Shield className="h-6 w-6" />
              <span>Disable All</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => {
                toast({
                  title: "Export Complete",
                  description: "Feature flags configuration exported.",
                })
              }}
            >
              <Settings className="h-6 w-6" />
              <span>Export Config</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => {
                toast({
                  title: "Sync Complete",
                  description: "Feature flags synced across all environments.",
                })
              }}
            >
              <Bell className="h-6 w-6" />
              <span>Sync All</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
