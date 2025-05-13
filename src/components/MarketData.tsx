
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketData as MarketDataType } from '@/types';
import { formatPercent } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";

interface MarketDataProps {
  data: MarketDataType | null;
  loading: boolean;
}

const MarketData = ({ data, loading }: MarketDataProps) => {
  if (loading) {
    return (
      <Card className="finance-card h-[400px] animate-pulse">
        <CardHeader>
          <CardTitle className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="finance-card">
        <CardHeader>
          <CardTitle>Market Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No market data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="finance-card">
      <CardHeader>
        <CardTitle>Market Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="allocation">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="allocation" className="space-y-4">
            {data.assetAllocation.map((item, i) => (
              <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{item.region} {item.sector}</h4>
                    <p className="text-sm text-muted-foreground">
                      Previous: {formatPercent(item.previousPercentage)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{formatPercent(item.percentage)}</div>
                    <div className={`
                      flex items-center text-sm
                      ${item.change > 0 ? 'text-finance-green' : ''}
                      ${item.change < 0 ? 'text-finance-red' : ''}
                      ${item.change === 0 ? 'text-gray-500' : ''}
                    `}>
                      {item.change > 0 && <ArrowUpRight className="w-3 h-3 mr-1" />}
                      {item.change < 0 && <ArrowDownRight className="w-3 h-3 mr-1" />}
                      {item.change === 0 && <ArrowRight className="w-3 h-3 mr-1" />}
                      {item.change > 0 && '+'}
                      {formatPercent(item.change)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="earnings" className="space-y-4">
            {data.earnings.map((item, i) => (
              <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-medium">{item.company} ({item.ticker})</h4>
                    <p className="text-sm text-muted-foreground">
                      Est: ${item.estimate.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">${item.actual.toFixed(2)}</div>
                    <div className={`
                      flex items-center text-sm
                      ${item.surprise > 0 ? 'text-finance-green' : ''}
                      ${item.surprise < 0 ? 'text-finance-red' : ''}
                      ${item.surprise === 0 ? 'text-gray-500' : ''}
                    `}>
                      {item.surprise > 0 && <ArrowUpRight className="w-3 h-3 mr-1" />}
                      {item.surprise < 0 && <ArrowDownRight className="w-3 h-3 mr-1" />}
                      {item.surprise === 0 && <ArrowRight className="w-3 h-3 mr-1" />}
                      {item.surprise > 0 && '+'}
                      {item.surprise}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="sentiment" className="space-y-4">
            {data.sentiment.map((item, i) => (
              <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{item.region}</h4>
                  <div className={`
                    px-2 py-1 text-xs rounded-full
                    ${item.score > 0.3 ? 'bg-green-100 text-green-800' : ''}
                    ${item.score < -0.3 ? 'bg-red-100 text-red-800' : ''}
                    ${(item.score >= -0.3 && item.score <= 0.3) ? 'bg-yellow-100 text-yellow-800' : ''}
                  `}>
                    {item.trendDirection === 'up' && 'Bullish'}
                    {item.trendDirection === 'down' && 'Bearish'}
                    {item.trendDirection === 'neutral' && 'Neutral'}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.factors.map((factor, j) => (
                    <span key={j} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketData;
