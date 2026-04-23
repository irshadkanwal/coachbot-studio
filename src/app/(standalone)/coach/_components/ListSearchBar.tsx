import { Button } from '@/shared/Button';
import Dropdown, { DropdownOption } from '@/shared/Dropdown';
import { Input } from '@/shared/Input';
import { Spinner } from '@/shared/Loaders';

interface ListSearchBarProps<T, K> {
  onSearch?: (event: React.ChangeEvent<HTMLInputElement>) => any;
  onSortChanged?: (opion: DropdownOption<T>) => any;
  onFilterChanged?: (opion: DropdownOption<K>) => any;
  className?: string;
  dropdownLabel?: string;
  sortOptions?: DropdownOption<T>[];
  filterOptions?: DropdownOption<K>[];
  searchEnabled?: boolean;
  filterSelectedValue?: K;
  sortSelectedValue?: T;
  isLoading?: boolean;
}

export default function ListSearchBar<T, K>({
  onSearch,
  onSortChanged,
  onFilterChanged,
  className,
  sortOptions,
  filterOptions,
  dropdownLabel,
  searchEnabled = true,
  filterSelectedValue,
  sortSelectedValue,
  isLoading = false,
}: ListSearchBarProps<T, K>) {
  return (
    <div className={`flex gap-x-3 ${className}`}>
      {searchEnabled && (
        <Input
          name="userSearch"
          id="userSearch"
          placeholderKey="CoachDetails.Users.searchPlaceholder"
          inputClassName="pe-10 rounded-xl bg-transparent border-storm-gray"
          className="relative w-2/3"
          onChange={onSearch}
        >
          {isLoading ? (
            <div className="absolute right-3 top-2">
              <Spinner className="text-xl text-main" />
            </div>
          ) : (
            <Button className="cbi-search absolute right-3 top-2 m-0 p-0 text-xl text-main" />
          )}
        </Input>
      )}
      {filterOptions && (
        <Dropdown
          selectedOption={filterSelectedValue || filterOptions[0].value}
          className="w-1/3 flex-grow text-nowrap py-1.5 text-light-gray"
          options={filterOptions}
          onSelectedChange={onFilterChanged}
          label={dropdownLabel}
        ></Dropdown>
      )}
      {sortOptions && (
        <Dropdown
          selectedOption={sortSelectedValue || sortOptions[0].value}
          className="w-1/3 flex-grow text-nowrap py-1.5 text-light-gray"
          options={sortOptions}
          onSelectedChange={onSortChanged}
          label={dropdownLabel}
        ></Dropdown>
      )}
    </div>
  );
}
