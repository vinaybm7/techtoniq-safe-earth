
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
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [magnitudeRange, setMagnitudeRange] = useState<number[]>([0, 10]);

  // Effect to sync magnitude range with filter values
  useEffect(() => {
    setMagnitudeRange([filterValues.minMagnitude, filterValues.maxMagnitude]);
  }, [filterValues.minMagnitude, filterValues.maxMagnitude]);

  const handleFilterValueChange = (key: keyof FilterValues, value: any) => {
    const newFilterValues = { ...filterValues, [key]: value };
    setFilterValues(newFilterValues as FilterValues);
  };

  const handleMagnitudeRangeChange = (values: number[]) => {
    if (values.length === 2) {
      setMagnitudeRange(values);
      setFilterValues(prev => ({
        ...prev,
        minMagnitude: values[0],
        maxMagnitude: values[1]
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
    };
    setFilterValues(resetValues);
    setMagnitudeRange([0, 10]);
    onFilterChange(resetValues);
    setIsOpen(false);
  };

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'asia', label: 'Asia' },
    { value: 'europe', label: 'Europe' },
    { value: 'northamerica', label: 'North America' },
    { value: 'southamerica', label: 'South America' },
    { value: 'africa', label: 'Africa' },
    { value: 'oceania', label: 'Oceania' },
    { value: 'antarctica', label: 'Antarctica' },
    { value: 'india', label: 'India' },  // Added specific option for India
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
                <Label htmlFor="magnitude">Magnitude Range</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{magnitudeRange[0].toFixed(1)}</span>
                  <Slider 
                    id="magnitude"
                    min={0} 
                    max={10} 
                    step={0.1} 
                    value={magnitudeRange}
                    onValueChange={handleMagnitudeRangeChange}
                    className="flex-1"
                  />
                  <span className="text-sm">{magnitudeRange[1].toFixed(1)}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Timeframe</Label>
                <ToggleGroup 
                  type="single" 
                  value={filterValues.timeframe}
                  onValueChange={(value: 'all' | 'today' | 'week' | 'month' | null) => {
                    if (value) handleFilterValueChange('timeframe', value);
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
        <ToggleGroup type="single" defaultValue="latest">
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
