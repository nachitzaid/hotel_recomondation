"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  User,
  CreditCard,
  Clock,
  Download,
  Check,
  X,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { AdminService } from "@/services/admin-service"
import { useAuth } from "@/contexts/auth-context"

// Interface pour les paiements
interface Payment {
  id: string
  reservationId: string
  userId: string
  userName: string
  amount: string
  method: "card" | "paypal" | "bank_transfer" | "other"
  status: "completed" | "pending" | "failed" | "refunded"
  transactionId: string
  date: string
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [payments, setPayments] = useState<Payment[]>([])
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false)
  const [paymentToRefund, setPaymentToRefund] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()


  // Charger les paiements
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true)
        const data = await AdminService.getPayments()

        // Transformer les données si nécessaire
        const formattedPayments = data.map((payment: any) => ({
          id: payment.id || payment._id,
          reservationId: payment.reservationId || "",
          userId: payment.userId || "",
          userName: payment.userName || "Utilisateur inconnu",
          amount: payment.amount || "0€",
          method: payment.method || "card",
          status: payment.status || "pending",
          transactionId: payment.transactionId || `TR-${Math.floor(Math.random() * 1000000)}`,
          date: payment.date || new Date().toLocaleDateString(),
        }))

        setPayments(formattedPayments)
      } catch (error) {
        console.error("Erreur lors du chargement des paiements:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les paiements. Utilisation de données de démonstration.",
          variant: "destructive",
        })

        // Utiliser des données fictives en cas d'erreur
        setPayments([
          {
            id: "1",
            reservationId: "1",
            userId: "1",
            userName: "Jean Dupont",
            amount: "1250€",
            method: "card",
            status: "completed",
            transactionId: "TR-123456",
            date: "01/06/2023",
          },
          {
            id: "2",
            reservationId: "2",
            userId: "2",
            userName: "Marie Martin",
            amount: "900€",
            method: "paypal",
            status: "pending",
            transactionId: "TR-234567",
            date: "01/07/2023",
          },
          {
            id: "3",
            reservationId: "3",
            userId: "4",
            userName: "Pierre Durand",
            amount: "625€",
            method: "card",
            status: "refunded",
            transactionId: "TR-345678",
            date: "15/07/2023",
          },
          {
            id: "4",
            reservationId: "4",
            userId: "5",
            userName: "Sophie Petit",
            amount: "3080€",
            method: "bank_transfer",
            status: "completed",
            transactionId: "TR-456789",
            date: "10/09/2023",
          },
          {
            id: "5",
            reservationId: "5",
            userId: "6",
            userName: "Thomas Grand",
            amount: "450€",
            method: "card",
            status: "failed",
            transactionId: "TR-567890",
            date: "15/10/2023",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [toast])

  // Filtrer les paiements en fonction des critères
  const filteredPayments = payments.filter((payment) => {
    // Filtre de recherche
    const matchesSearch =
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtre de statut
    const matchesStatus = selectedStatus === "all" || payment.status === selectedStatus

    // Filtre d'onglet
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "completed" && payment.status === "completed") ||
      (activeTab === "pending" && payment.status === "pending") ||
      (activeTab === "failed" && payment.status === "failed") ||
      (activeTab === "refunded" && payment.status === "refunded")

    return matchesSearch && matchesStatus && matchesTab
  })

  // Gérer le remboursement d'un paiement
  const handleRefundPayment = async () => {
    if (!paymentToRefund) return

    try {
      await AdminService.updatePaymentStatus(paymentToRefund, "refunded")

      // Mettre à jour la liste des paiements
      setPayments(
        payments.map((payment) => {
          if (payment.id === paymentToRefund) {
            return { ...payment, status: "refunded" }
          }
          return payment
        }),
      )

      toast({
        title: "Succès",
        description: "Le paiement a été remboursé avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors du remboursement du paiement:", error)
      toast({
        title: "Erreur",
        description: "Impossible de rembourser le paiement. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsRefundDialogOpen(false)
      setPaymentToRefund(null)
    }
  }

  // Gérer la mise à jour du statut d'un paiement
  const handleUpdatePaymentStatus = async (id: string, newStatus: string) => {
    try {
      await AdminService.updatePaymentStatus(id, newStatus)

      // Mettre à jour la liste des paiements
      setPayments(
        payments.map((payment) => {
          if (payment.id === id) {
            return { ...payment, status: newStatus as any }
          }
          return payment
        }),
      )

      toast({
        title: "Succès",
        description: `Le statut du paiement a été mis à jour avec succès.`,
      })
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut du paiement:`, error)
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le statut du paiement. Veuillez réessayer.`,
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Paiements</h1>
          <p className="text-gray-500">Gérez les paiements effectués sur votre plateforme.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un paiement..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrer par statut" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="completed">Complétés</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="failed">Échoués</SelectItem>
              <SelectItem value="refunded">Remboursés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="completed">Complétés</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="failed">Échoués</TabsTrigger>
          <TabsTrigger value="refunded">Remboursés</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Réservation</th>
                      <th className="px-4 py-3">Montant</th>
                      <th className="px-4 py-3">Méthode</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Transaction</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((payment) => (
                        <tr key={payment.id} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-mono">{payment.id}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center text-sm">
                              <User className="h-4 w-4 mr-1 text-gray-500" />
                              {payment.userName}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-mono">{payment.reservationId}</td>
                          <td className="px-4 py-4 text-sm font-medium">{payment.amount}</td>
                          <td className="px-4 py-4">
                            <Badge variant="outline">
                              <CreditCard className="h-3 w-3 mr-1" />
                              {payment.method === "card"
                                ? "Carte"
                                : payment.method === "paypal"
                                  ? "PayPal"
                                  : payment.method === "bank_transfer"
                                    ? "Virement"
                                    : "Autre"}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <Badge
                              className={`${
                                payment.status === "completed"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : payment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : payment.status === "failed"
                                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                                      : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              }`}
                            >
                              {payment.status === "completed"
                                ? "Complété"
                                : payment.status === "pending"
                                  ? "En attente"
                                  : payment.status === "failed"
                                    ? "Échoué"
                                    : "Remboursé"}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-sm font-mono">{payment.transactionId}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {payment.date}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {payment.status === "pending" && (
                                  <>
                                    <DropdownMenuItem
                                      className="text-green-600"
                                      onClick={() => handleUpdatePaymentStatus(payment.id, "completed")}
                                    >
                                      <Check className="mr-2 h-4 w-4" />
                                      Marquer comme payé
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleUpdatePaymentStatus(payment.id, "failed")}
                                    >
                                      <X className="mr-2 h-4 w-4" />
                                      Marquer comme échoué
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {payment.status === "completed" && (
                                  <DropdownMenuItem
                                    className="text-blue-600"
                                    onClick={() => {
                                      setPaymentToRefund(payment.id)
                                      setIsRefundDialogOpen(true)
                                    }}
                                  >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Rembourser
                                  </DropdownMenuItem>
                                )}
                                {payment.status === "failed" && (
                                  <DropdownMenuItem
                                    className="text-amber-600"
                                    onClick={() => handleUpdatePaymentStatus(payment.id, "pending")}
                                  >
                                    <Clock className="mr-2 h-4 w-4" />
                                    Marquer comme en attente
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                          Aucun paiement ne correspond à vos critères de recherche.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Les autres onglets ont un contenu similaire mais filtré */}
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="p-0">{/* Table content similar to "all" tab but filtered */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardContent className="p-0">{/* Table content similar to "all" tab but filtered */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed" className="space-y-4">
          <Card>
            <CardContent className="p-0">{/* Table content similar to "all" tab but filtered */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunded" className="space-y-4">
          <Card>
            <CardContent className="p-0">{/* Table content similar to "all" tab but filtered */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de confirmation de remboursement */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le remboursement</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir rembourser ce paiement ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleRefundPayment}>
              Rembourser
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

