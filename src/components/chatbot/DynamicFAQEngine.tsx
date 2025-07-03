
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, RefreshCw, Clock, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { dynamicFAQService, type DynamicFAQ } from '../../lib/dynamic-faq-service';
import { useToast } from '@/hooks/use-toast';

interface DynamicFAQEngineProps {
  onQuestionSelect?: (faq: DynamicFAQ) => void;
  compact?: boolean;
  showSearch?: boolean;
  maxItems?: number;
}

const DynamicFAQEngine: React.FC<DynamicFAQEngineProps> = ({
  onQuestionSelect,
  compact = false,
  showSearch = true,
  maxItems
}) => {
  const [faqs, setFaqs] = useState<DynamicFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const { toast } = useToast();

  // Load FAQs on component mount
  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const faqData = await dynamicFAQService.fetchFAQs();
      setFaqs(faqData);
      
      // Auto-expand first category
      if (faqData.length > 0) {
        const firstCategory = faqData[0].category;
        setExpandedCategories([firstCategory]);
      }
    } catch (error) {
      console.error('Failed to load FAQs:', error);
      toast({
        title: "Failed to load FAQs",
        description: "Using cached data. Please try refreshing.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const faqData = await dynamicFAQService.refreshFAQs();
      setFaqs(faqData);
      toast({
        title: "FAQs Updated",
        description: "Latest information loaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Could not fetch latest FAQs.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Filter and search FAQs
  const filteredFAQs = useMemo(() => {
    let filtered = dynamicFAQService.searchFAQs(faqs, searchQuery);
    
    // Sort by priority
    filtered.sort((a, b) => (a.priority || 999) - (b.priority || 999));
    
    // Limit items if specified
    if (maxItems && filtered.length > maxItems) {
      filtered = filtered.slice(0, maxItems);
    }
    
    return filtered;
  }, [faqs, searchQuery, maxItems]);

  // Group FAQs by category
  const groupedFAQs = useMemo(() => {
    return dynamicFAQService.groupByCategory(filteredFAQs);
  }, [filteredFAQs]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleQuestionClick = (faq: DynamicFAQ) => {
    if (onQuestionSelect) {
      onQuestionSelect(faq);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Loading FAQs...</h3>
        </div>
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Dynamic FAQs</h3>
          <Badge variant="secondary" className="text-xs">
            {faqs.length} questions
          </Badge>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-1"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* FAQ Categories */}
      {Object.entries(groupedFAQs).length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No FAQs found matching your search.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {Object.entries(groupedFAQs).map(([category, categoryFAQs]) => (
            <Card key={category} className="border-l-4 border-l-primary">
              <CardHeader 
                className="pb-2 cursor-pointer"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <span>{categoryFAQs[0]?.icon || '❓'}</span>
                    <span>{category}</span>
                    <Badge variant="outline" className="text-xs">
                      {categoryFAQs.length}
                    </Badge>
                  </CardTitle>
                  {expandedCategories.includes(category) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </CardHeader>
              
              {expandedCategories.includes(category) && (
                <CardContent className="pt-0">
                  <Accordion type="single" collapsible className="w-full">
                    {categoryFAQs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-start space-x-2 w-full">
                            <span className="text-sm font-medium">{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                              {faq.answer}
                            </p>
                            
                            {faq.lastUpdated && (
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>Updated: {new Date(faq.lastUpdated).toLocaleString()}</span>
                              </div>
                            )}
                            
                            {onQuestionSelect && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuestionClick(faq)}
                                className="text-xs"
                              >
                                Ask this question
                              </Button>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Last updated info */}
      {faqs.length > 0 && (
        <div className="text-center text-xs text-muted-foreground mt-4">
          <p>FAQs are automatically updated every 5 minutes</p>
        </div>
      )}
    </div>
  );
};

export default DynamicFAQEngine;
