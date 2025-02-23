import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";

export default function Page() {
  return (
    <div className="p-16">
      <div>
        <p className="text-2xl font-bold">Table</p>

        {/* TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Sites</CardTitle>
            <CardDescription>
              Manage all the sites you have created.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] sm:table-cell">
                    Image
                  </TableHead>
                  <TableHead>Site name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="md:table-cell">Created at</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SITES.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="sm:table-cell">
                      <img
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={site.img}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell className="md:table-cell">25</TableCell>
                    <TableCell className="md:table-cell">
                      {dayjs(site.createdAt).format("YYYY-MM-DD HH:mm A")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const SITES = [
  {
    id: 1,
    name: "Site 1",
    slug: "site-1",
    img: "/mock-images/image1.png",
    createdAt: new Date(),
    status: "draft",
  },
  {
    id: 2,
    name: "Site 2",
    slug: "site-2",
    img: "/mock-images/image2.png",
    createdAt: new Date(),
    status: "draft",
  },
];
