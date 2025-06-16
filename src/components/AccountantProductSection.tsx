
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { Product } from '@/types/product';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'CropGuard Pro',
    chemicalFormula: 'C12H8Cl6O',
    price: 450,
    availability: 'In Stock',
    dose: '2-3 ml per liter',
    category: 'Insecticide'
  },
  {
    id: '2',
    name: 'FungiFree Max',
    chemicalFormula: 'C14H9Cl5',
    price: 380,
    availability: 'Limited',
    dose: '1-2 ml per liter',
    category: 'Fungicide'
  },
  {
    id: '3',
    name: 'WeedKiller Ultra',
    chemicalFormula: 'C15H15Cl2N2O2',
    price: 520,
    availability: 'Out of Stock',
    dose: '3-4 ml per liter',
    category: 'Herbicide'
  },
  {
    id: '4',
    name: 'PlantBoost',
    chemicalFormula: 'C8H18N4O4',
    price: 290,
    availability: 'In Stock',
    dose: '5-10 ml per liter',
    category: 'Growth Regulator'
  }
];

export function AccountantProductSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [products, setProducts] = useState(mockProducts);
  const [editingAvailability, setEditingAvailability] = useState<string | null>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.chemicalFormula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'In Stock':
        return 'bg-green-500';
      case 'Limited':
        return 'bg-yellow-500';
      case 'Out of Stock':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleAvailabilityUpdate = (productId: string, newAvailability: string) => {
    setProducts(prev => prev.map(product =>
      product.id === productId ? { ...product, availability: newAvailability as Product['availability'] } : product
    ));
    setEditingAvailability(null);
    console.log(`Updated availability for product ${productId}:`, newAvailability);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <p className="text-muted-foreground">
          Manage product availability and view pricing information
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by product name or chemical formula..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <Collapsible
              open={expandedProduct === product.id}
              onOpenChange={() => setExpandedProduct(
                expandedProduct === product.id ? null : product.id
              )}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>{product.chemicalFormula}</CardDescription>
                      </div>
                      <Badge variant="secondary">{product.category}</Badge>
                      <Badge className={getAvailabilityColor(product.availability)}>
                        {product.availability}
                      </Badge>
                    </div>
                    {expandedProduct === product.id ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-600">Price</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600">
                          ₹{product.price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">per unit (read-only)</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-600">Availability</h4>
                      {editingAvailability === product.id ? (
                        <div className="flex items-center space-x-2">
                          <Select
                            defaultValue={product.availability}
                            onValueChange={(value) => handleAvailabilityUpdate(product.id, value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="In Stock">In Stock</SelectItem>
                              <SelectItem value="Limited">Limited</SelectItem>
                              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Badge className={getAvailabilityColor(product.availability)}>
                            {product.availability}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingAvailability(product.id)}
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Update
                          </Button>
                        </div>
                      )}
                      <p className="text-sm text-gray-500">Current stock status</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-600">Recommended Dose</h4>
                      <p className="text-lg font-medium">{product.dose}</p>
                      <p className="text-sm text-gray-500">Application rate</p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No products found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
