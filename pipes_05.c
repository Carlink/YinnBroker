/*Realice un programa en C que resulte en la ejecución de la siguiente orden:
ls -la | grep ^d | tail -1
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <signal.h>
#include <errno.h>
#include <time.h>

 #define NUM_HIJOS 2



Solución:

 
 /* número de hijos a crear. */
 
void hijo1(int fds[2], int fds2[2])
{
	close(fds2[0]);
	close(fds2[1]);
	close(fds[0]);
	dup2(fds[1], STDOUT_FILENO);
	close(fds[1]);
	execlp("ls", "ls", "-la", NULL);
	perror("fallo en execlp");
	exit(EXIT_FAILURE);
}
 
void hijo2(int fds[2], int fds2[2])
{	
 
 
	close(fds2[0]);
	dup2(fds2[1], STDOUT_FILENO);
	close(fds2[1]);
	close(fds[1]);
	dup2(fds[0], STDIN_FILENO);
	close(fds[0]);
	execlp("grep", "grep", "^d", NULL);
	perror("fallo en execlp");
	exit(EXIT_FAILURE);
}
void hijo3(int fds[2], int fds2[2])
{
	close(fds[0]);
	close(fds[1]);
	close(fds2[1]);
	dup2(fds2[0], STDIN_FILENO);
	close(fds2[0]);
	execlp("tail", "tail", "-1", NULL);
	perror("fallo en execlp");
	exit(EXIT_FAILURE);
}
 
int main(void)
{
	int ret, i, fds[2], fds2[2];
 
	if (pipe(fds) == -1) {
		perror("fallo en pipe");
		exit(EXIT_FAILURE);
	}
	if (pipe(fds2) == -1) {
		perror("fallo en pipe");
		exit(EXIT_FAILURE);
	}
 
	/*CREAR 3 HIJOS EN PARALELO*/
	for (i=0; i<=NUM_HIJOS; i++) {
		ret = fork();
		if (ret == 0) {
			/* estamos en alguno de los hijos. */
			switch(i) {
				case 0:
					/* tratamiento hijo 1. */
					hijo1(fds, fds2);
					exit(EXIT_SUCCESS);
				case 1:
					/* tratamiento hijo 2. */
					hijo2(fds, fds2);
					exit(EXIT_SUCCESS);
				case 2:
					/* tratamiento hijo 3. */
					hijo3(fds, fds2);
					exit(EXIT_SUCCESS);
			}
		} else if (ret > 0) {
			/* tratamiento del padre */
		} else if (ret == -1) {
			perror("fallo en fork");
			exit(EXIT_FAILURE);
		}
	}
	/* tratamiento del padre una vez lanzados ambos hijos. */
	close(fds[0]);
	close(fds[1]);
 	close(fds2[0]);
	close(fds2[1]);
 
	ret = wait(NULL);
	while (ret > 0) {
		ret = wait(NULL);
	}
	/* si hay error, ignoramos si no hay más hijos a esperar. */
	if (ret == -1 && errno != ECHILD) {
		perror("fallo en wait");
		exit(EXIT_FAILURE);
	}
}




 
