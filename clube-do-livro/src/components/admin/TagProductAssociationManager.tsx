import React, { useState, useEffect } from 'react';
import {
  Link2,
  Unlink,
  RefreshCw,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  DollarSign,
  Tag,
  Package
} from 'lucide-react';
import { 
  hotmartIntegrationService, 
  TagProductAssociation, 
  HotmartProduct,
  HotmartSyncResult
} from '../../services/hotmart-integration.service';
import { tagService, TagWithStats } from '../../services/tag.service';
import { CourseAccessLevel } from '../../types/admin.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AssociationWithDetails extends TagProductAssociation {
  tag?: TagWithStats;
  product?: HotmartProduct | null;
}

export default function TagProductAssociationManager() {
  const [associations, setAssociations] = useState<AssociationWithDetails[]>([]);
  const [availableTags, setAvailableTags] = useState<TagWithStats[]>([]);
  const [availableProducts, setAvailableProducts] = useState<HotmartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [syncStatusFilter, setSyncStatusFilter] = useState<'all' | 'synced' | 'pending' | 'error'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [createErrors, setCreateErrors] = useState<string[]>([]);
  const [lastSyncResult, setLastSyncResult] = useState<HotmartSyncResult | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      // Load associations with tag and product details
      const rawAssociations = hotmartIntegrationService.getAllAssociations();
      const associationsWithDetails: AssociationWithDetails[] = rawAssociations.map(assoc => {
        const tag = tagService.getTagsWithStats().find(t => t.id === assoc.tagId);
        const product = hotmartIntegrationService.getProductById(assoc.hotmartProductId);
        return {
          ...assoc,
          tag,
          product
        };
      });

      setAssociations(associationsWithDetails);
      setAvailableTags(hotmartIntegrationService.getUnassociatedTags().map(tag => {
        const tagWithStats = tagService.getTagsWithStats().find(t => t.id === tag.id);
        return tagWithStats || { ...tag, studentsCount: 0, coursesCount: 0 };
      }));
      setAvailableProducts(hotmartIntegrationService.getUnassociatedProducts());
    } catch (error) {
      console.error('Error loading associations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await hotmartIntegrationService.syncTagsWithHotmart();
      setLastSyncResult(result);
      loadData(); // Reload data after sync
    } catch (error) {
      console.error('Error syncing:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateAssociation = () => {
    const errors = hotmartIntegrationService.validateTagProductCompatibility(selectedTag, selectedProduct);
    setCreateErrors(errors);

    if (errors.length > 0) return;

    try {
      hotmartIntegrationService.createAssociation(selectedTag, selectedProduct);
      setShowCreateModal(false);
      setSelectedTag('');
      setSelectedProduct('');
      setCreateErrors([]);
      loadData();
    } catch (error) {
      setCreateErrors([`Erro ao criar associação: ${error}`]);
    }
  };

  const handleToggleAssociation = (associationId: string) => {
    try {
      hotmartIntegrationService.toggleAssociation(associationId);
      loadData();
    } catch (error) {
      console.error('Error toggling association:', error);
    }
  };

  const handleRemoveAssociation = (associationId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta associação? Esta ação não pode ser desfeita.')) {
      try {
        hotmartIntegrationService.removeAssociation(associationId);
        loadData();
      } catch (error) {
        console.error('Error removing association:', error);
      }
    }
  };

  const getFilteredAssociations = () => {
    return associations.filter(assoc => {
      const matchesSearch = !searchTerm || 
        assoc.tag?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assoc.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assoc.hotmartProductId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && assoc.isActive) ||
        (statusFilter === 'inactive' && !assoc.isActive);

      const matchesSyncStatus = syncStatusFilter === 'all' || assoc.syncStatus === syncStatusFilter;

      return matchesSearch && matchesStatus && matchesSyncStatus;
    });
  };

  const getAccessLevelLabel = (level: CourseAccessLevel) => {
    const labels = {
      [CourseAccessLevel.FREE]: 'Gratuito',
      [CourseAccessLevel.PREMIUM]: 'Premium',
      [CourseAccessLevel.VIP]: 'VIP'
    };
    return labels[level];
  };

  const getAccessLevelColor = (level: CourseAccessLevel) => {
    const colors = {
      [CourseAccessLevel.FREE]: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      [CourseAccessLevel.PREMIUM]: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      [CourseAccessLevel.VIP]: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
    };
    return colors[level];
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const statistics = hotmartIntegrationService.getAssociationStatistics();
  const filteredAssociations = getFilteredAssociations();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-terracota" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Carregando associações...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Associações Tag-Produto Hotmart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie as associações entre tags e produtos do Hotmart
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar'}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Associação
          </button>
        </div>
      </div>

      {/* Sync Result Alert */}
      {lastSyncResult && (
        <div className={`p-4 rounded-lg border ${
          lastSyncResult.success 
            ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {lastSyncResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
              <span className={`font-medium ${
                lastSyncResult.success 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {lastSyncResult.success ? 'Sincronização concluída' : 'Erro na sincronização'}
              </span>
            </div>
            <button
              onClick={() => setLastSyncResult(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
          <div className={`mt-2 text-sm ${
            lastSyncResult.success 
              ? 'text-green-700 dark:text-green-300' 
              : 'text-red-700 dark:text-red-300'
          }`}>
            {lastSyncResult.syncedCount} sincronizada(s), {lastSyncResult.errorCount} erro(s)
            {lastSyncResult.errors.length > 0 && (
              <ul className="mt-1 ml-4">
                {lastSyncResult.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.total}</p>
            </div>
            <div className="p-3 bg-terracota/10 rounded-lg">
              <Link2 className="w-6 h-6 text-terracota" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ativas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.active}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sincronizadas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.synced}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <RefreshCw className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Erros</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.errors}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por tag ou produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativa</option>
              <option value="inactive">Inativa</option>
            </select>
            
            <select
              value={syncStatusFilter}
              onChange={(e) => setSyncStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos os Sync</option>
              <option value="synced">Sincronizada</option>
              <option value="pending">Pendente</option>
              <option value="error">Erro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Associations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Produto Hotmart
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nível de Acesso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sincronização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Criada em
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAssociations.map((assoc) => (
                <tr key={assoc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {assoc.tag ? (
                        <>
                          <div 
                            className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                            style={{ backgroundColor: assoc.tag.color }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {assoc.tag.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {assoc.tag.slug}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-red-500">Tag não encontrada</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assoc.product ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {assoc.product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {assoc.product.id} • R$ {assoc.product.price.toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm text-red-500">Produto não encontrado</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {assoc.hotmartProductId}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assoc.product && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccessLevelColor(assoc.product.accessLevel)}`}>
                        {getAccessLevelLabel(assoc.product.accessLevel)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleAssociation(assoc.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        assoc.isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      } hover:opacity-80`}
                    >
                      {assoc.isActive ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ativa
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Inativa
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getSyncStatusIcon(assoc.syncStatus)}
                      <span className="ml-2 text-sm text-gray-900 dark:text-white capitalize">
                        {assoc.syncStatus}
                      </span>
                      {assoc.lastSyncAt && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {format(assoc.lastSyncAt, 'dd/MM HH:mm', { locale: ptBR })}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {format(assoc.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleAssociation(assoc.id)}
                        className={`${
                          assoc.isActive
                            ? 'text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300'
                            : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                        }`}
                        title={assoc.isActive ? 'Desativar' : 'Ativar'}
                      >
                        {assoc.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleRemoveAssociation(assoc.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Remover"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAssociations.length === 0 && (
            <div className="text-center py-12">
              <Link2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma associação encontrada
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== 'all' || syncStatusFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando uma associação entre tag e produto'}
              </p>
              {!searchTerm && statusFilter === 'all' && syncStatusFilter === 'all' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Criar primeira associação
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Association Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Nova Associação Tag-Produto
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedTag('');
                  setSelectedProduct('');
                  setCreateErrors([]);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4">
              {createErrors.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <ul className="text-sm text-red-800 dark:text-red-200">
                    {createErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tag*
                  </label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Selecione uma tag</option>
                    {tagService.getTagsWithStats().map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name} - {getAccessLevelLabel(tag.accessLevel)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Produto Hotmart*
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Selecione um produto</option>
                    {hotmartIntegrationService.getHotmartProducts().map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - R$ {product.price.toFixed(2)} ({getAccessLevelLabel(product.accessLevel)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedTag('');
                  setSelectedProduct('');
                  setCreateErrors([]);
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateAssociation}
                disabled={!selectedTag || !selectedProduct}
                className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar Associação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}