"use client";

import { 
  ChevronRight,
  FileEdit,
  HardDriveDownloadIcon,
  PlusCircle,
  Trash2,
  Upload,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import Link from "next/link"

const items = [
  {
    title: "Atualizações",
    url: "#",
    icon: HardDriveDownloadIcon,
    submenu: [
      { title: "Cadastrar", icon: PlusCircle, url: "/cadastrar" },
      { title: "Excluir", icon: Trash2, url: "/excluir" },
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 font-bold text-xl ">
      </SidebarHeader>
      <Link href="/"><img src="logo_intesis.png" alt="" className="w-3/4 m-auto"/></Link>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Aplicação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <Collapsible key={item.title} asChild className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} className="hover:bg-blue-600 hover:fill-white hover:text-white">
                        <item.icon className="text-blue-400 transition-color" />
                        <span className="font-medium">{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <SidebarMenuSub className="border-l-slate-700 ml-4">
                        {item.submenu.map((sub) => (
                          <SidebarMenuSubItem key={sub.title} onClick={(e) => e.stopPropagation()}>
                            <SidebarMenuSubButton asChild className="hover:bg-blue-500 hover:text-white text-black transition-all">
                              <Link href={sub.url} className="flex items-center gap-2">
                                <sub.icon size={16} className="text-black transition-colors" />
                                <span>{sub.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}