

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <string.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/sendfile.h>
#define PORT 1895

char webpage[] =
"HTTP/1.1 200 Ok\r\n"
"Content-Type: text/html; charset=UTF-8\r\n\r\n"
"<!DOCTYPE html>\r\n"
"<html><head><title>Test Title</title>\r\n"
"<body>JPG <img src='test.jpg'/></body>"
"<body>PNG <img src='test.png'/></body>"
"</html>";

char webpage2[] =
"HTTP/1.1 404 Not Found\r\n"
"Content-Type: text/html; charset=UTF-8\r\n\r\n"
"<!DOCTYPE html>\r\n"
"<html><head><title>Test Title</title>\r\n"
"<body>404 Not Found </body>"
"</html>";

char imageheader[] =
"HTTP/1.1 200 Ok\r\n"
"Content-Type: image/jpeg\r\n\r\n";

char imageheader2[] =
"HTTP/1.1 200 Ok\r\n"
"Content-Type: image/png\r\n\r\n";

int main(int argc, char *argv[]){
    struct sockaddr_in server_addr, client_addr;
    socklen_t sin_len = sizeof(client_addr);
    int fd_server, fd_client;

    char buf[2048000];
    int fdimg;
    int on = 1;

    fd_server = socket(AF_INET, SOCK_STREAM, 0);
    if(fd_server < 0){
        printf("Socket failed");
        exit(1);
    }

    setsockopt(fd_server, SOL_SOCKET, SO_REUSEADDR, &on, sizeof(int));

    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(PORT);

    if(bind(fd_server, (struct sockaddr *) &server_addr, sizeof(server_addr)) == -1){
        printf("Bind failed\n");
        close(fd_server);
        exit(1);
    }

    if(listen(fd_server, 10) == -1){
        printf("Listen failed\n");
        close(fd_server);
        exit(1);
    }
    int index
    while(1){
        fd_client = accept(fd_server, (struct sockaddr *) &client_addr, &sin_len);

        if(fd_client == -1){
            printf("Accept failed\n");
            exit(0);
        }



        if(!fork()){


            close(fd_server);
            memset(buf, 0, 2048000);
            read(fd_client, buf, 2048000);
            printf("Fork: \n%s\n",buf);



        if (  !strncmp(buf, "GET /index.html", 15) || (!strncmp(buf, "GET /test.jpg", 13)) ||(!strncmp(buf, "GET /test.png", 13)) )  {

          if (!strncmp(buf, "GET /test.jpg", 13)) {


  write(fd_client, imageheader, sizeof(imageheader)  - 1);

  fdimg = open("test.jpg", O_RDONLY);
  FILE* fp = fdopen(fdimg, "rb");
  fseek(fp, 0L, SEEK_END);
  int sz = ftell(fp);
  fseek(fp, 0, SEEK_SET);
  sendfile(fd_client, fdimg, NULL, sz);

  close(fdimg);
}

  else if (!strncmp(buf, "GET /test.png", 13)) {


write(fd_client, imageheader, sizeof(imageheader)  - 1);

fdimg = open("test.png", O_RDONLY);
FILE* fp = fdopen(fdimg, "rb");
fseek(fp, 0L, SEEK_END);
int sz = ftell(fp);
fseek(fp, 0, SEEK_SET);
sendfile(fd_client, fdimg, NULL, sz);

close(fdimg);
}
          else{
              write(fd_client, webpage, sizeof(webpage) - 1);
          }

          close(fd_client);

          exit(0);


        }
        else{
            write(fd_client, webpage2, sizeof(webpage2) - 1);
        }

        close(fd_client);

        exit(0);

        }


        close(fd_client);


    }


    return 0;

  }
