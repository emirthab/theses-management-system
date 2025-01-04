import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThesisType } from '@prisma/client';
import { getKeywords, searchTheses } from '../actions';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { getAuthors } from '@/app/people/actions';
import { getUniversities } from '@/app/university/actions';
import SearchResultList from '../_views/search-result-list';
import { Suspense } from 'react';
import SearchResultLoading from '../_views/search-result-loading';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { makeHrefFromParams } from '@/lib/utils';

export async function generateStaticParams() {
  const keywords = await getKeywords();
  const universities = await getUniversities();
  const authors = await getAuthors();

  return { keywords, universities, authors };
}

export default async function ThesisSearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;
  const keywords = await getKeywords();
  const universities = await getUniversities();
  const authors = await getAuthors();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Theses</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/thesis/search" method="GET">
            <div className="grid gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  name="q"
                  placeholder="Search by title..."
                  defaultValue={params?.q}
                  className="flex-1"
                />
                <Select
                  name='type'
                  defaultValue={params?.type as ThesisType}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={'unassigned'}>All Types</SelectItem>
                      {Object.values(ThesisType).map((type) => (
                        <SelectItem key={type} value={type}>{type.replace(/([a-z])([A-Z])/g, '$1 $2')}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  name='year'
                  defaultValue={params?.year as string}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">All Years</SelectItem>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  name='author_id'
                  defaultValue={params?.author_id as string}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Author" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">All Authors</SelectItem>
                    {authors.map((author) => (
                      <SelectItem key={author.author_id} value={author.author_id.toString()}>{author.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <MultipleSelector
                  value={params?.keywords ?
                    Array.isArray(params.keywords) ?
                      params.keywords.map(keyword => ({ value: keyword, label: keyword || '' })) :
                      [{ value: params.keywords, label: params.keywords || '' }] :
                    [] as Option[]}
                  name='keywords'
                  defaultOptions={keywords.map(keyword => ({ value: keyword, label: keyword }))}
                  creatable
                  hidePlaceholderWhenSelected
                  placeholder="Select keyword(s)"
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      No keywords found. You can write keyword name and add.
                    </p>
                  }
                />
                <Select
                  name='university_id'
                  defaultValue={params?.university_id as string}>
                  <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder="University" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">All Universities</SelectItem>
                    {universities.map((university) => (
                      <SelectItem key={university.university_id} value={university.university_id.toString()}>{university.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type='submit' className="w-full md:w-auto">Search</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Suspense fallback={<SearchResultLoading />}>
        <PageContent searchParams={params} />
      </Suspense>
    </div>
  );
}

async function PageContent({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { theses, totalItems, totalPages } = await searchTheses(
    searchParams?.q as string,
    searchParams?.type !== "unassigned" ? (searchParams?.type as ThesisType) : undefined,
    parseInt(searchParams?.year as string),
    parseInt(searchParams?.author_id as string),
    searchParams?.keywords as string[] | string,
    parseInt(searchParams?.university_id as string),
    searchParams?.page ? parseInt(searchParams?.page as string) : 1,
  );

  const currentPage = searchParams?.page ? parseInt(searchParams.page as string) : 1;

  return (
    <Card>
      <CardContent className="pt-6">
        <SearchResultList theses={theses} />
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href={"/thesis/search?" + makeHrefFromParams({ ...searchParams, page: (currentPage - 1).toString() })} />
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={"/thesis/search?" + makeHrefFromParams({ ...searchParams, page: page.toString() })}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext href={"/thesis/search?" + makeHrefFromParams({ ...searchParams, page: (currentPage + 1).toString() })} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  )
}