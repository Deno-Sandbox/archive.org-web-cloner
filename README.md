# archive.org-web-cloner

# install:

- install deno
- run script `deno run -A --unstable ---no-check main.ts`
- setup a domain on this: exemple.com => 5.5.5.5(your server ip) => apache2 proxy to => this deno script on (look at the port on the main.ts file)


# Use:
## Only web view:
- go on the URL and the website displayed

## Cloner
- `wget -nv -r -p -e robots=off -np -U "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0" "https://YOUR PROXY URL/" --page-requisites --no-check-certificate`


