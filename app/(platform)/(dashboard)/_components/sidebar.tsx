"use client";

import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { NavItem, Organization } from "./nav-items";

interface SidebarProps {
  storageKey?: string;
}
const Sidebar = ({ storageKey = "t-sidebar-state" }: SidebarProps) => {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(storageKey, {});

  const { organization: activeOrganization, isLoaded: isLoadedOrganization } = useOrganization();

  const { userMemberships, isLoaded: isLoadedOrganizationList } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce((acc: string[], key: string) => {
    if (expanded[key]) {
      acc.push(key);
    }
    return acc;
  }, []);

  //   {"123":true} => ["123"]

  const onExpand = (id: string) => {
    setExpanded((curr) => ({
      ...curr,
      [id]: !expanded[id],
    }));
  };

  if (!isLoadedOrganization || !isLoadedOrganizationList || userMemberships.isLoading) {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <NavItem.Skeleton />
          <NavItem.Skeleton />
          <NavItem.Skeleton />
        </div>
      </>
    );
  }
  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1 ">
        <span className="pl-4">Workspaces</span>
        <Button size="icon" asChild type="button" variant="ghost" className="ml-auto">
          <Link href="/select-org">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Accordion type="multiple" defaultValue={defaultAccordionValue} className="space-y-2">
        {userMemberships.data.map(({ organization }) => (
          <NavItem key={organization.id} isActive={activeOrganization?.id === organization.id} isExpanded={expanded[organization.id]} organization={organization as Organization} onExpand={onExpand} />
        ))}
      </Accordion>
    </>
  );
};

export default Sidebar;
