
import { useState, useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, MapPin, BarChart, Clock } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export interface FilterValues {
  minMagnitude: number;
  maxMagnitude: number;
  timeframe: 'all' | 'today' | 'week' | 'month';
  region: string;
  sortBy: 'latest' | 'magnitude' | 'location';
}

interface EarthquakeFilterProps {
  onFilterChange: (filters: FilterValues) => void;
  displayLimit: number;
  onDisplayLimitChange: (limit: number) => void;
}

const EarthquakeFilter = ({ 
  onFilterChange, 
  displayLimit, 
  onDisplayLimitChange 
}: EarthquakeFilterProps) => {
  const [filterValues, setFilterValues] = useState<FilterValues>({
    minMagnitude: 0,
    maxMagnitude: 10,
    timeframe: 'all',
    region: 'all',
    sortBy: 'latest',
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [magnitudeValue, setMagnitudeValue] = useState<number>(filterValues.maxMagnitude);

  // Effect to apply filter changes when sort option changes
  useEffect(() => {
    onFilterChange(filterValues);
  }, [filterValues.sortBy, onFilterChange]);

  const handleFilterValueChange = (key: keyof FilterValues, value: any) => {
    const newFilterValues = { ...filterValues, [key]: value };
    setFilterValues(newFilterValues);
  };

  const handleMagnitudeChange = (values: number[]) => {
    if (values.length === 1) {
      setMagnitudeValue(values[0]);
      setFilterValues(prev => ({
        ...prev,
        minMagnitude: 0,
        maxMagnitude: values[0]
      }));
    }
  };

  const handleApplyFilters = () => {
    onFilterChange(filterValues);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetValues: FilterValues = {
      minMagnitude: 0,
      maxMagnitude: 10,
      timeframe: 'all',
      region: 'all',
      sortBy: filterValues.sortBy, // Keep current sort option
    };
    setFilterValues(resetValues);
    setMagnitudeValue(10);
    onFilterChange(resetValues);
    setIsOpen(false);
  };

  const handleSortChange = (value: 'latest' | 'magnitude' | 'location' | null) => {
    if (value) {
      handleFilterValueChange('sortBy', value);
    }
  };

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'india', label: 'India (Enhanced Historical Data)' },
    { value: 'asia', label: 'Asia (excluding India)' },
    { value: 'europe', label: 'Europe' },
    { value: 'northamerica', label: 'North America' },
    { value: 'southamerica', label: 'South America' },
    { value: 'africa', label: 'Africa' },
    { value: 'oceania', label: 'Oceania' },
    { value: 'antarctica', label: 'Antarctica' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
      <div className="flex gap-2 items-center">
        <Select
          value={displayLimit.toString()}
          onValueChange={(value) => onDisplayLimitChange(Number(value))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Show 10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">Show 10</SelectItem>
            <SelectItem value="15">Show 15</SelectItem>
            <SelectItem value="20">Show 20</SelectItem>
            <SelectItem value="50">Show 50</SelectItem>
            <SelectItem value="100">Show 100</SelectItem>
          </SelectContent>
        </Select>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Earthquake Filters</h4>
                <p className="text-sm text-muted-foreground">
                  Customize what earthquake data you see
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="magnitude">Maximum Magnitude: {magnitudeValue.toFixed(1)}</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">0.0</span>
                  <Slider 
                    id="magnitude"
                    min={0} 
                    max={10} 
                    step={0.1} 
                    value={[magnitudeValue]}
                    onValueChange={handleMagnitudeChange}
                    className="flex-1"
                  />
                  <span className="text-sm">10.0</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Timeframe</Label>
                <ToggleGroup 
                  type="single" 
                  value={filterValues.timeframe}
                  onValueChange={(value) => {
                    if (value) handleFilterValueChange('timeframe', value as 'all' | 'today' | 'week' | 'month');
                  }}
                  className="justify-start"
                >
                  <ToggleGroupItem value="all" aria-label="All time">
                    <Calendar className="h-4 w-4 mr-1" /> All
                  </ToggleGroupItem>
                  <ToggleGroupItem value="today" aria-label="Today">
                    Today
                  </ToggleGroupItem>
                  <ToggleGroupItem value="week" aria-label="Week">
                    Week
                  </ToggleGroupItem>
                  <ToggleGroupItem value="month" aria-label="Month">
                    Month
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="region">Region</Label>
                <Select
                  value={filterValues.region}
                  onValueChange={(value) => handleFilterValueChange('region', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {filterValues.region === 'india' && (
                  <p className="text-xs text-blue-600">
                    Shows 10 years of regular data plus older significant earthquakes (M4.5+) from all Indian states and territories
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Reset
                </Button>
                <Button size="sm" onClick={handleApplyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        <ToggleGroup 
          type="single" 
          value={filterValues.sortBy}
          onValueChange={(value) => handleSortChange(value as 'latest' | 'magnitude' | 'location' | null)}
        >
          <ToggleGroupItem value="latest" aria-label="Show latest">
            <Clock className="h-4 w-4 mr-1" /> Latest
          </ToggleGroupItem>
          <ToggleGroupItem value="magnitude" aria-label="Sort by magnitude">
            <BarChart className="h-4 w-4 mr-1" /> Magnitude
          </ToggleGroupItem>
          <ToggleGroupItem value="location" aria-label="Group by location">
            <MapPin className="h-4 w-4 mr-1" /> Location
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default EarthquakeFilter;
