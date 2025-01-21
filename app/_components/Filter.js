"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Filter() {
    const filterButtons = [
        { name: "All cabins", filterValue: "all" },
        { name: "1—3 guests", filterValue: "small" },
        { name: "4—7 guests", filterValue: "medium" },
        { name: "8—12 guests", filterValue: "large" },
    ];

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const selectedFilter = searchParams.get("capacity") ?? "all";

    function handleSelectFilter(filter) {
        const params = new URLSearchParams(searchParams);
        params.set("capacity", filter);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    return (
        <div className="flex border border-primary-800">
            {filterButtons.map((button) => (
                <Button
                    key={button.filterValue}
                    filter={button.filterValue}
                    handleSelectFilter={handleSelectFilter}
                    selectedFilter={selectedFilter}
                >
                    {button.name}
                </Button>
            ))}
        </div>
    );
}

function Button({ filter, handleSelectFilter, selectedFilter, children }) {
    return (
        <button
            type="button"
            role="button"
            className={`px-5 py-2 hover:bg-primary-700 ${selectedFilter === filter ? "bg-primary-700 text-primary-50" : ""}`}
            onClick={() => handleSelectFilter(filter)}
        >
            {children}
        </button>
    );
}

export default Filter;
